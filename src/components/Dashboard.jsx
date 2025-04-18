import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import TransactionHistory from "./TransactionHistory";

function Dashboard() {
  const navigate = useNavigate();

  
  return (
    <div>
      <h1>Dashboard</h1>
      
      <TransactionHistory /> 
    </div>
  );
}

export default Dashboard;
