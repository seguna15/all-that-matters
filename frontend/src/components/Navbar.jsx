import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react"
import logo from "../assets/android-chrome-192x192.png"
import { Link } from "react-router-dom"
import { useAuthStore } from "../store/authStore"



export const Navbar = () => {
    const {user, logout} = useAuthStore()
    const isAdmin = user?.isAdmin;

    //Logout function
    const handleLogout = async (e) => {
      e.preventDefault();
      await logout();
    };

  return (
    <header className="fixed top-0 left-0 z-40 w-full transition-all duration-300 bg-gray-900 border-b shadow-lg bg-opacity-90 backdrop-blur-md border-emerald-800">
        <nav className="container px-4 py-3 mx-auto">
            <div className="flex flex-wrap items-center justify-between">
                <Link className="flex space-x-2">
                    <img src={logo} className="object-cover w-10 h-10" />
                </Link>
                <menu className="flex flex-wrap items-center gap-4">
                    <Link
                        to={"/"}
                        className="text-gray-300 transition duration-300 ease-in-out hover:text-emerald-400"
                    >
                        Home
                    </Link>
                    {user && (
                        <Link
                        to={"/cart"}
                        className="relative text-gray-300 transition duration-300 ease-in-out group hover:text-emerald-400"
                        >
                            <ShoppingCart
                                className="inline-block mr-1 group-hover:text-emerald-400"
                                size={20}
                            />
                            <span className="hidden sm:inline">Cart</span>
                            <span className="absolute -top-2 -left-2 bg-emerald-200 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out">
                                {3}
                            </span>
                        </Link>
                    )}
                    {isAdmin && (
                    
                        <Link to={"/admin"} className="flex items-center px-3 py-1 font-medium text-white transition duration-300 ease-in-out rounded-md bg-emerald-700 hover:bg-emerald-600">
                            <Lock className="inline-block mr-1" size={18}/>
                            <span className="hidden sm:inline">Dashboard</span>
                        </Link>
                        
                    )}

                    {user? (
                        <button className="flex items-center px-4 py-2 text-white transition duration-300 ease-in-out bg-gray-700 rounded-md hover:bg-gray-600" onClick={handleLogout}>
                            <LogOut size={18}/>
                            <span className="hidden ml-2 sm:inline">Log Out </span>
                        </button>
                    ) : (
                        <>
                            <Link to={"/auth/register"} className="flex items-center px-4 py-2 text-white transition duration-300 ease-in-out rounded-md bg-emerald-600 hover:bg-emerald-700">
                                <UserPlus className="mr-2" size={18} />
                                Register
                            </Link>
                            <Link to={"/auth/login"} className="flex items-center px-4 py-2 text-white transition duration-300 ease-in-out bg-gray-700 rounded-md hover:bg-gray-600">
                                <LogIn className="mr-2" size={18} />
                                Login
                            </Link>
                        </>
                    )}
                </menu>
            </div>
       
        </nav>
    </header>
  );
}
