import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"

const Layout = () =>{
    return (
        <div className='w-screen h-full'>
            <Navbar/>

            <div className='p-2'>
                <Outlet/>
            </div>
        </div>
    )
}

export default Layout