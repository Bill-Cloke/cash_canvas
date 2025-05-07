import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";
import authenticate from "../middleware/authenticate.js";
import syncPlaidTransactions from "../middleware/syncPlaidTransactions.js";

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "supersecret";

router.get('/transaction-history', authenticate, async (req, res) => {
    const userId = req.user.userId; 

    const query = `
    SELECT
        t.date,
        t.amount,
        t.merchant,
        t.category,
        b.mask
    FROM transactions t
    JOIN bank_accounts b ON t.account_id = b.account_id
    WHERE b.user_id = ?
    ORDER BY t.date DESC;
  `;

  
    try {
      await syncPlaidTransactions(userId);
      const [results] = await db.query(query, [userId]);
      res.json(results);  
    } catch (err) {
      console.error("Error fetching transaction history:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  
router.post("/create-default-bank-account", async (req, res) => {
    const { username } = req.body;
  
    try {
      
    const [user] = await db.query("SELECT user_id FROM users WHERE username = ?", [username]);
    const userId = user[0].user_id;


      await db.query(
        "INSERT INTO bank_accounts (user_id, name, mask, type, balance) VALUES (?, ?, ?, ?, ?)",
        [
          userId,   
          'Cash',    
          8080,   
          'Cash',    
          0.00,      
        ]
      );
  
      res.json({ message: "Default bank account created successfully!" });
  
    } catch (err) {
      console.error("Bank account creation error:", err);
      res.status(500).json({ error: "Error creating default bank account" });
    }
});

router.post("/input-transaction", authenticate, async (req, res) => {
    const { date, amount, merchant, category } = req.body;
    const userId = req.user.userId
  
    try {
     
      
  
      const [account] = await db.query("SELECT account_id FROM bank_accounts WHERE user_id = ?", [userId]);
      const accountId = account[0].account_id;
  
      await db.query(
        "INSERT INTO transactions (date, amount, merchant, category, account_id) VALUES (?, ?, ?, ?, ?)",
        [date, amount, merchant, category, accountId]
      );

      await db.query(
        "UPDATE bank_accounts SET balance = balance + ? WHERE account_id = ? AND name = 'Cash'",
        [amount, accountId]
      );
  
      res.json({ message: "Transaction input successful!" });
    } catch (err) {
      console.error("Transaction input error:", err);
      res.status(500).json({ error: "Error inputting transaction" });
    }
  });

router.post('/create_link_token', authenticate, async (req, res, next) => {
    const client = req.app.locals.plaidClient;
    try {
      const { data } = await client.linkTokenCreate({
        user:          { client_user_id: String(req.user.id) },
        client_name:   'Cash Canvas',
        products:      ['auth', 'transactions'],
        country_codes: ['US'],
        language:      'en',
      });
      res.json({ linkToken: data.link_token });
    } catch (err) {
      next(err);
    }
  });

router.post('/exchange_public_token', authenticate, async (req, res, next) => {
    const client   = req.app.locals.plaidClient;
    const { public_token } = req.body;
    const userId   = req.user.userId;
  
    try {
      // exchange public_token for access_token & item_id
      const exchangeRes = await client.itemPublicTokenExchange({ public_token });
      const { access_token, item_id } = exchangeRes.data;
  
      // fetch all the linked accounts
      const accountsRes = await client.accountsGet({ access_token });
      const accounts    = accountsRes.data.accounts; 
  
      
      const insertSQL = `
        INSERT INTO bank_accounts
          (user_id, access_token, item_id, name, mask, type, balance, p_account_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
  
      
      await Promise.all(accounts.map(acct => {
        return db.query(
          insertSQL,
          [
            userId,
            access_token,
            item_id,
            acct.name,            
            acct.mask,            
            acct.subtype,       
            acct.balances.current,
            acct.account_id, 
          ]
        );
      }));
  
      res.json({
        success: true,
        item_id,
        accounts_added: accounts.length
      });
    } catch (err) {
      next(err);
    }
  });

router.get('/accounts', authenticate, async (req, res, next) => {
    const userId = req.user.userId;
    try {
        const [accounts] = await db.query(
            `SELECT account_id, name, mask, type, balance FROM bank_accounts WHERE user_id = ?`,
        [userId]
        );
      res.json(accounts);
    }
    catch (err) {
      next(err);
    }
   
});



export default router;
