import  { useState } from 'react'
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, useParams } from 'react-router-dom';
import { Lock, Loader } from 'lucide-react';
import { Input } from '../../components';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const {resetPassword, error, isLoading, message} = useAuthStore();
    const {token} = useParams();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
      await resetPassword(token, password);

      toast.success(
        "Password reset successfully, redirecting to login page..."
      );  
    }

    return (
      <main className="relative min-h-screen overflow-hidden text-white bg-gray-900 font-nunitoSans">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
          </div>
        </div>
        <div className="flex items-center justify-center min-h-screen ">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md overflow-hidden bg-gray-800 bg-opacity-50 shadow-xl backdrop-filter backdrop-blur-xl rounded-2xl"
          >
            <div className="p-8">
              <h2 className="mb-6 text-3xl font-bold text-center text-transparent bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text">
                Reset Password
              </h2>
              {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
              {message && (
                <p className="mb-4 text-sm text-green-500">{message}</p>
              )}
              <form onSubmit={handleSubmit}>
                <Input
                  icon={Lock}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  icon={Lock}
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTop={{ scale: 0.98 }}
                  className="w-full px-4 py-3 font-bold text-white transition duration-200 rounded-lg shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader className="mx-auto size-6 animate-spin" />
                  ) : (
                    "Set New Password"
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </main>
    );
}

export default ResetPassword