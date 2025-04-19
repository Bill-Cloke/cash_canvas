import { NavLink } from "react-router-dom"
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const handleLogout = async () => {
        const navigate = useNavigate();
        try {
          const res = await fetch("http://localhost:8080/api/auth/logout", {
            method: "POST",
            credentials: "include", 
          });
    
          if (res.ok) {
            navigate("/");  
          } else {
            console.error("Logout failed");
          }
        } catch (error) {
          console.error("Error logging out:", error);
        }
      };

      
    return (
        <div className='w-full h-max p-2 bg-green-600 flex flex-row relative '>
            <h1>$$CashCanvas</h1>

            <div className='absolute right-2 top-2'>
                <NavLink to='/'>Home</NavLink>
                <NavLink to='/login'>Login</NavLink>
                 
            </div>

        </div>
    )
}

export default Navbar