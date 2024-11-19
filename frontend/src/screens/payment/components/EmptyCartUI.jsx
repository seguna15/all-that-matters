import { motion } from "framer-motion"; 
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";


 const EmptyCartUI = () => (
  <motion.div
    className="flex flex-col items-center justify-center py-16 space-y-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <ShoppingCart className="w-24 h-24 text-gray-300" />
    <h3 className="text-2xl font-semibold ">Your cart is empty</h3>
    <p className="text-gray-400">
      Looks like you {"haven't"} added anything to your cart yet.
    </p>
    <Link
      className="px-6 py-2 mt-4 text-white transition-colors rounded-md bg-emerald-500 hover:bg-emerald-600"
      to="/"
    >
      Start Shopping
    </Link>
  </motion.div>
);


export default EmptyCartUI;