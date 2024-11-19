import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { useCartsStore } from "../../../store/cartsStore";
import { useAuthStore } from "../../../store/authStore";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";


const CartSummary = () => {
  const {  subTotal,  cart  } = useCartsStore();
  const {user} = useAuthStore()
  const navigate = useNavigate();
  const [cartError, setCartError] = useState([])
  useEffect(() => {
    const errors = []
    cart.forEach((item) => {
      if (item?.quantity < item.boughtQty) {
        errors.push(
          `${item?.name} cart quantity ${item?.boughtQty} exceed available quantity ${item?.quantity}`
        ); 
      }
    }); 
    setCartError(errors);
  }, [cart])
 
  
  const formattedSubtotal = subTotal?.toFixed(2);

  const handlePayment = async () => {
   
    if (cartError.length > 0) {
      toast.error("Checkout item must not exceed available quantity");
      return;
    } 
    navigate("/checkout")
     

      
  };
 

 

  return (
    <motion.div
      className="p-4 space-y-4 bg-gray-800 border-gray-700 rounded-lg shadow-sm bcart sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xl font-semibold text-emerald-400">Order summary</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <dl className="flex items-center justify-between gap-4 pt-2 border-t border-gray-600">
            <dt className="text-base font-bold text-white">Total</dt>
            <dd className="text-base font-bold text-emerald-400">
              &#8358;{formattedSubtotal}
            </dd>
          </dl>
        </div>

        <motion.button
          className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:bg-gray-500"
          disabled={cartError.length > 0}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePayment}
        >
          Proceed to Checkout
        </motion.button>

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-gray-400">or</span>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium underline text-emerald-400 hover:text-emerald-300 hover:no-underline"
          >
            Continue Shopping
            <MoveRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
export default CartSummary;
