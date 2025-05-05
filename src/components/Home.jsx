import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Welcome to Cash Canvas!</h2>
            {/* <div className="flex flex-row justify-center items-center bg-white p-2">
                <img src="https://www.clipartmax.com/png/small/208-2081266_dollar-clipart-vector-dollar-bill-clip-art.png" alt="Dollar Clipart Vector - Dollar Bill Clip Art @clipartmax.com" className="bg-white p-2 inline-block"></img>
            </div> */}
            <p>Manage your expenses with ease</p>
            <p className='mb-2'>Signup or Login to get started</p>
            
            <div className='flex flex-row gap-x-5'>
                <NavLink to='/login'>Login</NavLink>
                <NavLink to='/signup'>Signup</NavLink>
            </div>       
        </div>
    );
    }
export default Home;