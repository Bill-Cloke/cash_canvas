import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/auth/session", { credentials: "include" }) 
      .then(res => res.json())
      .then(data => {
        if (data.loggedIn) {
          setMessage("Already logged in");
          setTimeout(() => navigate("/dashboard"), 2000);
        }
      })
      .catch((error) => console.error("Session check failed", error));
  }, []);

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); 

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setMessage(errorData.error || "Login failed"); 
        return;
      }

     
      setMessage("Login successful!");
      setTimeout(() => navigate("/dashboard"), 2000);  

    } catch (error) {
      setMessage("Error connecting to the server.");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '1rem' }}>
     
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
        <button type="button" onClick={() =>  navigate("/reset-password")}> Forgot Password? </button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Login;
