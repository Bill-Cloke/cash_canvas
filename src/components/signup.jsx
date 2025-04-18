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

      const bankRes = await fetch("http://localhost:8080/api/auth/create-default-bank-account", {
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
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '1rem' }}>
            <button onClick={() => navigate("/")}>Home</button>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <input type="password" name="password2" placeholder="Confirm Password" onChange={handleChange} required />
                <input type="text" name="access_phrase" placeholder="Access Phrase" onChange={handleChange} required />
                <button type="submit">Sign Up</button>
            </form>
            <p>{message}</p>
        </div>
    );
    }

export default Signup;