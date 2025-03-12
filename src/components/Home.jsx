import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div>
        <h2>Welcome to Cash Canvas!</h2>
        <p>Manage your expenses with ease</p>
        <p>Signup or Login to get started</p>
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/signup")}>Signup</button>
        </div>
    );
    }
export default Home;