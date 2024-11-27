import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "../../components";
import { Mail, Loader, Lock } from "lucide-react";
import { Link, } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";
import { main } from "framer-motion/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, googleLogin, isGoogleLoading } = useAuthStore();
  
  //local login
  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

 
 

  return (
    <main className="relative min-h-screen overflow-hidden text-white bg-gray-900 font-nunitoSans">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div>
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <motion.div
          className="sm:mx-auto sm:w-full sm:max-w-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mt-6 text-3xl font-extrabold text-center text-emerald-400">
            Create your account
          </h2>
        </motion.div>
        <motion.div
          className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="px-4 py-8 bg-gray-800 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleLogin} className="space-y-6">
              <Input
                icon={Mail}
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                icon={Lock}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="flex items-center mb-6">
                <Link
                  to={"/auth/forgot-password"}
                  className="text-green-400 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <motion.button
                className="w-full px-4 py-3 mt-5 font-bold text-white transition duration-200 rounded-lg shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="mx-auto size-6 animate-spin" />
                ) : (
                  "Login"
                )}
              </motion.button>
              
            </form>
            <div className="flex justify-center px-8 py-4 mt-6 bg-gray-900 bg-opacity-50">
              <p className="text-sm text-gray-300">
                Don't have an account?{" "}
                <Link
                  to={"/auth/register"}
                  className="text-green-400 hover:underline"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default Login;
