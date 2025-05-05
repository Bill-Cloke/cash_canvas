import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/auth/session", { credentials: "include" }) 
      .then(res => res.json())
      .then(data => {
        if (data.loggedIn) {
          setMessage("logged in");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="Username" 
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition" 
              onChange={handleChange} required 
            />
            <input type="password" name="password" placeholder="Password" 
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
              onChange={handleChange} required 
            />
            <button type="submit" className ="w-full mt-2 styled-button">Login</button>
            {/* <button type="button" className ="bg-green-600 rounded hover:bg-green-700" onClick={() =>  navigate("/reset-password")}> Forgot Password? </button> */}
          </form>
          <div className="flex justify-between mt-4">
            <NavLink to="/signup">Sign Up</NavLink>
            <NavLink to="/reset-password">Forgot Password?</NavLink>
          </div>
          <p>{message}</p>
      </div>
    </div>
  );
}

export default Login;
