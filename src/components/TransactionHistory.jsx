import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/bank/transaction-history", {
          withCredentials: true, 
        });
        
        if (Array.isArray(response.data)) {
          setTransactions(response.data);
        } else {
          console.error("Invalid response data:", response.data);
          setTransactions([]);
        }

      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <div>Loading Transactions...</div>;
  }

  /*return (
    <div>
      <h3>Your Transactions</h3>
      {transactions.length === 0 ? (
        <div>No transactions found.</div>
      ) : (
        <ul>
          {transactions.map((txn, idx) => (
            <li key={idx}>
              {new Date(txn.date).toLocaleDateString()} - {txn.merchant} - {txn.category} - ${txn.amount} - Account: {txn.mask === 0 ? "Cash" : txn.mask}
            </li>
          ))}
        </ul>
      )}
    </div>
  )*/

    return (
      <div className='w-full h-max flex justify-center'>
        <table className='border-1 rounded'>
          <thead>
            <tr className='py-2 border-b-2 bg-green-50'>
              <th>Date</th>
              <th>Merchant</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Account</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, idx) => (
              <tr key={idx} className='py-1 border-b-1 odd:bg-gray-200 even:bg-white'>
                <td>{new Date(txn.date).toLocaleDateString()}</td>
                <td>{txn.merchant}</td>
                <td>{txn.category}</td>
                <td>${txn.amount}</td>
                <td>{txn.mask === 8080 ? "Cash" : txn.mask}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
}

export default TransactionHistory;
