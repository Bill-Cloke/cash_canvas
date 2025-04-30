import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import TransactionHistory from "./TransactionHistory";
import { NavLink } from "react-router-dom";
import ConnectBankButton from "./ConnectBankButton";

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
    <div className= "w-full h-max p-2 bg-blue-100 rounded flex flex-col relative ">
      {/* <NavLink to='#' onClick={handleLogout}>Logout</NavLink> */}
      {/* <button onClick={handleLogout} className=" bg-green-600 hover:bg-green-700 rounded-1g">Logout</button> */}
      <h1>Dashboard</h1>
      <ConnectBankButton />
      <button onClick={() => setShowForm(!showForm)} className="bg-green-300 text-black px-3 py-1 rounded hover:bg-green-500">
        {showForm ? "Cancel" : "Add Transaction"}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-2 p-4 bg-gray-100 rounded">
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          <input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount" required />
          <input type="text" name="merchant" value={formData.merchant} onChange={handleChange} placeholder="Merchant" required />
          <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" required />
          <button type="submit" className="bg-green-600 text-black px-2 py-1 rounded">Submit</button>
        </form>
      )}

      <TransactionHistory /> 
    </div>
  );
}

export default Dashboard;
