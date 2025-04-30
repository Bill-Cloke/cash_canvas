import { NavLink } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState("false");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch('http://localhost:8080/api/auth/session', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setLoggedIn(data.loggedIn);
      })
      .catch(() => setLoggedIn(false));
  }, [location]);


  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include", 
    });
    
    if (res.ok) {
      setTimeout(() => {
        window.location.reload()
      }, 2000)
      navigate("/");  
    } else {
      console.error("Logout failed");
    }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };


  return (
    <div className='w-full h-max p-2 bg-green-300 flex flex-row relative '>
      <h1>$$CashCanvas</h1>

      <div className='absolute right-2 top-2'>
        <NavLink to='/'>Home</NavLink>
        {loggedIn ? (
          <NavLink to='#' onClick={handleLogout}> Logout </NavLink>
        ) : (
          <NavLink to="/login"> Login </NavLink>
        )}
        {/* <NavLink to='/login'>Login</NavLink>  */}
                 
      </div>

    </div>
  )
}

export default Navbar