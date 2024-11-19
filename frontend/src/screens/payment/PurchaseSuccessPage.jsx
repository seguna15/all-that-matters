import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCartsStore } from "../../store/cartsStore";
import Confetti from "react-confetti";
import { Spinner } from "../../components";

const PurchaseSuccessPage = () => {

   const { getCartItems, isLoading } = useCartsStore();

   useEffect(() => {
     getCartItems();
   }, [getCartItems]);
   
 

  return (
    <div className="flex items-center justify-center h-screen px-4">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.1}
        style={{ zIndex: 99 }}
        numberOfPieces={700}
        recycle={false}
      />

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="relative z-10 w-full max-w-md overflow-hidden bg-gray-800 rounded-lg shadow-xl">
          <div className="p-6 sm:p-8">
            <div className="flex justify-center">
              <CheckCircle className="w-16 h-16 mb-4 text-emerald-400" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-center sm:text-3xl text-emerald-400">
              Purchase Successful!
            </h1>

            <p className="mb-2 text-center text-gray-300">
              Thank you for your order. {"We're"} processing it now.
            </p>
            <p className="mb-6 text-sm text-center text-emerald-400">
              Check your email for order details and updates.
            </p>
            <div className="p-4 mb-6 bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  Estimated delivery
                </span>
                <span className="text-sm font-semibold text-emerald-400">
                  3-5 business days
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <button className="flex items-center justify-center w-full px-4 py-2 font-bold text-white transition duration-300 rounded-lg bg-emerald-600 hover:bg-emerald-700">
                <HandHeart className="mr-2" size={18} />
                Thanks for trusting us!
              </button>
              <Link
                to={"/"}
                className="flex items-center justify-center w-full px-4 py-2 font-bold transition duration-300 bg-gray-700 rounded-lg hover:bg-gray-600 text-emerald-400"
              >
                Continue Shopping
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PurchaseSuccessPage;
