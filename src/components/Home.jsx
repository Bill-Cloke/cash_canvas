import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/plaid-logo.png";

function Home() {
    const navigate = useNavigate();

    return (
        <div className='min-h-screen flex items-center justify-center bg-green-50 p-4 flex-col'>
            <div className='p-5 font-serif bg-white rounded-lg shadow-lg'> 
                <h2 className='font-serif text-xl'>Welcome to Cash Canvas!</h2>
            
                {/* <div className="flex flex-row justify-center items-center bg-white p-2">
                    <img src="https://www.clipartmax.com/png/small/208-2081266_dollar-clipart-vector-dollar-bill-clip-art.png" alt="Dollar Clipart Vector - Dollar Bill Clip Art @clipartmax.com" className="bg-white p-2 inline-block"></img>
                </div> */}
                <p className='font-serif text-xl'>Manage your expenses with ease.</p>
                {/* <p className='font-serif mb-2 text-xl'>Signup or Login to get started.</p> */}
            
                <div className='flex flex-row gap-x-5 items-center bg-white rouned justify-center mt-10'>
                    <NavLink to='/login'>Login</NavLink>
                    <p className='font-ShadowsIntoLight text-xl'>or</p>
                    <NavLink to='/signup'>Signup</NavLink>
                </div>       
            </div>
                    <h1 className='text-xl text-center font-semibold my-2 bg-white p-4 rounded-lg shadow-2xl flex flex-col mx-110  min-w-40 font-serif mt-10'>Sync your bank accout with Plaid!</h1>
            <div className='bg-white p-2 rounded-lg shadow-lg mt-15 items-center'>
                <img src={logo} alt="Logo" className="h-20"/>  
            </div>
        </div>

         
    );
    }
export default Home;