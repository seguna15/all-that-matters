import { Link } from "react-router-dom";
import { Loader2, MoveRight } from "lucide-react";
import { useCartsStore } from "../../../store/cartsStore";
import { apiClient } from "../../../api";
import { useAuthStore } from "../../../store/authStore";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useState } from "react";


const OrderSummary = ({
  shippingAddress,
  useAsShippingAddress,
  isAddressValid,
}) => {
  const { total, subTotal, coupon, isCouponApplied, cart } = useCartsStore();

  const [checkOutLoading, setCheckOutLoading] = useState(false);

  const savings = subTotal - total;
  const formattedSubtotal = subTotal?.toFixed(2);
  const formattedTotal = total?.toFixed(2);
  const formattedSavings = savings?.toFixed(2);

  const handlePayment = async () => {
    setCheckOutLoading(true)
    try {
      const res = await apiClient.post("/orders/create-checkout-session", {
        amount: formattedTotal,
        subTotal: formattedSubtotal,
        saving: formattedSavings,
        couponCode: coupon ? coupon.code : null,
        discountPercentage: coupon ? coupon.discountPercentage : null,
        cartItems: cart,
        shippingAddress: {
          firstName: shippingAddress?.firstName?.value,
          lastName: shippingAddress?.lastName?.value,
          address: shippingAddress?.address?.value,
          city: shippingAddress?.city?.value,
          state: shippingAddress?.state?.value,
          country: shippingAddress?.country?.value,
          phoneCode: shippingAddress?.phoneCode?.value,
          phoneNumber: shippingAddress?.phoneNumber?.value,
          zipCode: shippingAddress?.zipCode?.value,
        },
        useAsShippingAddress,
      });

      const session = res?.data?.data?.authorization_url;
      window.location.replace(session);
      setCheckOutLoading(false)
      return;
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Oops cart functionality down"
      );
      setCheckOutLoading(false)
    } 
  };

  return (
    <motion.div
      className="p-4 space-y-4 bg-gray-800 border border-gray-700 rounded-lg shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xl font-semibold text-emerald-400">Order summary</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-300">
              Original price
            </dt>
            <dd className="text-base font-medium text-white">
              &#8358;{formattedSubtotal}
            </dd>
          </dl>

          {savings > 0 && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">Savings</dt>
              <dd className="text-base font-medium text-emerald-400">
                - &#8358;{formattedSavings}
              </dd>
            </dl>
          )}

          {coupon && isCouponApplied && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">
                Coupon ({coupon.code})
              </dt>
              <dd className="text-base font-medium text-emerald-400">
                -{coupon.discountPercentage}%
              </dd>
            </dl>
          )}
          <dl className="flex items-center justify-between gap-4 pt-2 border-t border-gray-600">
            <dt className="text-base font-bold text-white">Total</dt>
            <dd className="text-base font-bold text-emerald-400">
              &#8358;{formattedTotal}
            </dd>
          </dl>
        </div>

        <motion.button
          className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:bg-gray-500"
          disabled={checkOutLoading || !isAddressValid}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePayment}
        >
          {checkOutLoading ? (
            <Loader2 className="w-6 h-6" />
          ) : (
            "Proceed to Checkout"
          )}
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
export default OrderSummary;
