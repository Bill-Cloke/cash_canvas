import db from '../db.js';                   
import plaidClient from '../plaidClient.js'; 

export default async function syncPlaidTransactions(userId) {
  
  const [acctRows] = await db.query(
    `SELECT 
       account_id,
       p_account_id,
       access_token,
       COALESCE(last_sync_cursor, '') AS last_sync_cursor
     FROM bank_accounts
     WHERE user_id = ?
       AND access_token IS NOT NULL
       AND p_account_id IS NOT NULL`,
    [userId]
  );

  // group them by access_token 
  const byToken = acctRows.reduce((h, a) => {
    (h[a.access_token] ||= []).push(a);
    return h;
  }, {});

  // sync each token
  for (const [access_token, rows] of Object.entries(byToken)) {
    const cursor = rows[0].last_sync_cursor || undefined;

    
    const syncReq = {
      access_token,
      count:           500,
      ...(cursor && { cursor }),
    //    include_removed: true
    };

    // console.log('Plaid sync request:', JSON.stringify(syncReq, null, 2));

    let data;
    try {
      ({ data } = await plaidClient.transactionsSync(syncReq));
    } catch (err) {
      console.error('Plaid sync error:', err.response?.data || err);
      throw err;
    }
    const { added, modified, removed, next_cursor } = data;

  
    const toInsert = [...added, ...modified].map(tx => {
      
      const local = rows.find(r => r.p_account_id === tx.account_id);
      return [
        local.account_id,
        tx.transaction_id,
        tx.date,
        tx.amount,
        tx.name,
        
        tx.personal_finance_category?.primary
          || tx.category?.[0]
          || 'Uncategorized'
      ];
    });

    if (toInsert.length) {
      await db.query(
        `INSERT INTO transactions
           (account_id, plaid_tid, date, amount, merchant, category)
         VALUES ?
         ON DUPLICATE KEY UPDATE
           date     = VALUES(date),
           amount   = VALUES(amount),
           merchant = VALUES(merchant),
           category = VALUES(category)
        `,
        [toInsert]
      );
    }

    
    if (removed.length) {
      const ids = removed.map(r => r.transaction_id);
      await db.query(
        `DELETE FROM transactions WHERE plaid_tid IN (?)`,
        [ids]
      );
    }

    
    await db.query(
      `UPDATE bank_accounts
         SET last_sync_cursor = ?, last_sync_at = NOW()
       WHERE access_token = ?`,
      [next_cursor, access_token]
    );
  }
}