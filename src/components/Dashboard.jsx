import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import TransactionHistory from "./TransactionHistory";
import { NavLink } from "react-router-dom";
import ConnectBankButton from "./ConnectBankButton";
import BankAccounts from "./BankAccounts";

function Dashboard() {
  
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({date: '', amount: '', merchant: '', category: '',});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/bank/input-transaction", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(formData),
      });
  
      const result = await res.json();
      if (res.ok) {
        alert(result.message);
        setShowForm(false);
        setFormData({ date: '', amount: '', merchant: '', category: '' });

        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        alert(result.error || 'Error inputting transaction');
      }
    } catch (err) {
      console.error('Error submitting transaction:', err);
    }
  };

    
  // const handleLogout = async () => {
    
  //   try {
  //     const res = await fetch("http://localhost:8080/api/auth/logout", {
  //       method: "POST",
  //       credentials: "include", 
  //     });

  //     if (res.ok) {
  //       navigate("/");  
  //     } else {
  //       console.error("Logout failed");
  //     }
  //   } catch (error) {
  //     console.error("Error logging out:", error);
  //   }
  // };

  
  return (
    <div className= "w-full h-max p-2 bg-green-50 rounded flex flex-col relative ">
      {/* <img src={vite}/> */}
      {/* <NavLink to='#' onClick={handleLogout}>Logout</NavLink> */}
      {/* <button onClick={handleLogout} className=" bg-green-600 hover:bg-green-700 rounded-1g">Logout</button> */}
      <div className='w-full h-max flex justify-center '>
        <h1 className='text-xl text-center font-semibold my-2 bg-white p-4 rounded-lg shadow flex flex-col mx-110  min-w-40 font-ShadowsIntoLight'>Canvas</h1>
      </div>
      <BankAccounts />
      <div className='w-full h-max flex flex-col items-center'>
        <div className='flex flex-col'>
          <ConnectBankButton />
          <button onClick={() => setShowForm(!showForm)} className="styled-button mt-2 mb-2 max-w-100 max-h-10">
            {showForm ? "Cancel" : "Add Cash Transaction"}
          </button>
        </div>

      <div className='max-h-30'>  
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-2 p-4 border border-green-400 bg-white rounded ">
            <input type="date" name="date" value={formData.date} className='w-60 h-8 border border-gray-300 mx-2 px-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition' onChange={handleChange} required />
            <input type="number" step="0.01" name="amount" value={formData.amount} className='w-60 border border-gray-300 p-1 mx-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition' onChange={handleChange} placeholder="Amount" required />
            <input type="text" name="merchant" value={formData.merchant} className='w-60 border border-gray-300 mx-2 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition' onChange={handleChange} placeholder="Merchant" required />
            <input type="text" name="category" value={formData.category} className='w-60 border border-gray-300 p-1 mx-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition' onChange={handleChange} placeholder="Category" required />
            <button type="submit" className="styled-button">Submit</button>
          </form>
        )}
      </div>
    </div>

      <TransactionHistory/> 
    </div>
  );
}

export default Dashboard;
