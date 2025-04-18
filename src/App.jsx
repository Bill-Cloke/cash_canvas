import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import ProtectedRoute from "./components/protectedRoute";
import Signup from "./components/Signup";
import Home from "./components/Home";
import ResetPassword from "./components/ResetPassword";
import Dashboard from "./components/Dashboard";
import './App.css'
import Layout from "./components/Layout";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />}>
            </Route>
          </Route>
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;