import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
    const [formData, setFormData] = useState({ username: "", password: "" , password2: "", access_phrase: ""});
    const [message, setMessage] = useState(""); 
    const navigate = useNavigate();
  


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
    
   const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (formData.password !== formData.password2) {
      setMessage("Passwords do not match");
      return;
    }
    

    try {
      const res = await fetch("http://localhost:8080/api/auth/signup", {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setMessage(errorData.error || "Signup failed"); 
        return;
      }

      const bankRes = await fetch("http://localhost:8080/api/bank/create-default-bank-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: formData.username })
      });
  
      if (!bankRes.ok) {
        const bankErrorData = await bankRes.json();
        setMessage(bankErrorData.error || "Error creating default bank account");
        return;
      }

      setMessage("Signup successful!");
      setTimeout(() => navigate("/login"), 2000); 

    } catch (error) {
      setMessage("Error connecting to the server.");
    }
  };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center mb-6">Signup</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition' onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition' onChange={handleChange} required />
                <input type="password" name="password2" placeholder="Confirm Password" className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition' onChange={handleChange} required />
                <input type="text" name="access_phrase" placeholder="Access Phrase" className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition' onChange={handleChange} required />
                <button type="submit" className ="w-full mt-2 styled-button">Sign Up</button>
            </form>
            <p>{message}</p>
        </div>
      </div>
    );
    }

export default Signup;