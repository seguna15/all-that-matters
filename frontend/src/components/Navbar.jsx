import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/favicon-32x32.png";

import NavLinks from "./NavLinks";
import { useAuthStore } from "../store/authStore";
import { LayoutDashboard, LogIn, LogOut, ShoppingCart, UserPlus } from "lucide-react";

export const Navbar = () => {

    const { user, logout } = useAuthStore();
    const isAdmin = user?.isAdmin;

    //Logout function
    const handleLogout = async (e) => {
      e.preventDefault();
      await logout();
    };
    
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 z-[1000] w-full text-black bg-white">
      <div className="flex items-center justify-around font-medium">
        <div className="z-50 flex justify-between w-full p-5 md:w-auto">
          <img src={Logo} alt="logo" className="md:cursor-pointer h-9" />
          <div className="text-3xl md:hidden" onClick={() => setOpen(!open)}>
            <ion-icon name={`${open ? "close" : "menu"}`}></ion-icon>
          </div>
        </div>
        <ul className="md:flex hidden uppercase items-center gap-8 font-[Poppins]">
          <li>
            <Link to="/" className="inline-block px-3 py-7">
              Home
            </Link>
          </li>
          <NavLinks />
          <li>
            <Link to="/" className="inline-block px-3 py-7">
              About
            </Link>
          </li>
        </ul>
        <div className="items-center hidden gap-4 md:flex">
          {user && (
            <Link
              to={"/cart"}
              className="relative text-black transition duration-300 ease-in-out group hover:text-emerald-500"
            >
              <ShoppingCart
                className="inline-block mr-1 group-hover:text-emerald-500"
                size={20}
              />
              <span className="sm:inline">Cart</span>
              <span className="absolute -top-2 -left-2 bg-emerald-400 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-500 transition duration-300 ease-in-out">
                {3}
              </span>
            </Link>
          )}

          {isAdmin && (
            <Link
              to={"/admin"}
              className="flex items-center px-3 py-2 font-medium text-white transition duration-300 ease-in-out rounded-md bg-emerald-700 hover:bg-emerald-600"
            >
              <LayoutDashboard className="inline-block mr-1" size={18} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          )}

          {user ? (
            <button
              className="flex items-center px-4 py-2 text-white transition duration-300 ease-in-out bg-gray-700 rounded-md hover:bg-gray-600"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span className="hidden ml-2 sm:inline">Log Out </span>
            </button>
          ) : (
            <>
              <Link
                to={"/auth/register"}
                className="flex items-center px-4 py-2 text-white transition duration-300 ease-in-out rounded-md bg-emerald-600 hover:bg-emerald-700"
              >
                <UserPlus className="mr-2" size={18} />
                Register
              </Link>
              <Link
                to={"/auth/login"}
                className="flex items-center px-4 py-2 text-white transition duration-300 ease-in-out bg-gray-700 rounded-md hover:bg-gray-600"
              >
                <LogIn className="mr-2" size={18} />
                Login
              </Link>
            </>
          )}
        </div>
        {/* Mobile nav */}
        <ul
          className={`
        md:hidden bg-white fixed w-full top-0 overflow-y-auto bottom-0 py-24 pl-4
        duration-500 ${open ? "left-0" : "left-[-100%]"}
        `}
        >
          <li>
            <Link to="/" className="inline-block px-3 py-7">
              Home
            </Link>
          </li>
          <NavLinks />
          <li>
            <Link to="/" className="inline-block px-3 py-7">
              About
            </Link>
          </li>
          <div className="flex flex-col gap-6 py-5">
            {user && (
              <Link
                to={"/cart"}
                className="relative text-black transition duration-300 ease-in-out group hover:text-emerald-500"
              >
                <ShoppingCart
                  className="inline-block mr-1 group-hover:text-emerald-500"
                  size={20}
                />
                <span className="sm:inline">Cart</span>
                <span className="absolute -top-2 -left-2 bg-emerald-400 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-500 transition duration-300 ease-in-out">
                  {3}
                </span>
              </Link>
            )}

            {isAdmin && (
              <Link
                to={"/admin"}
                className="flex items-center px-4 py-2 font-medium text-white transition duration-300 ease-in-out rounded-md w-fit bg-emerald-700 hover:bg-emerald-600"
              >
                <LayoutDashboard className="inline-block mr-1" size={18} />
                <span className="sm:inline">Dashboard</span>
              </Link>
            )}

            {user ? (
              <button
                className="flex items-center px-4 py-2 text-white transition duration-300 ease-in-out bg-gray-700 rounded-md w-fit hover:bg-gray-600"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span className="ml-2 sm:inline">Log Out </span>
              </button>
            ) : (
              <>
                <Link
                  to={"/auth/register"}
                  className="flex items-center px-4 py-2 text-white transition duration-300 ease-in-out rounded-md w-fit bg-emerald-600 hover:bg-emerald-700"
                >
                  <UserPlus className="mr-2" size={18} />
                  Register
                </Link>
                <Link
                  to={"/auth/login"}
                  className="flex items-center px-4 py-2 text-white transition duration-300 ease-in-out bg-gray-700 rounded-md w-fit hover:bg-gray-600"
                >
                  <LogIn className="mr-2" size={18} />
                  Login
                </Link>
              </>
            )}
          </div>
        </ul>
      </div>
    </nav>
  );
};


