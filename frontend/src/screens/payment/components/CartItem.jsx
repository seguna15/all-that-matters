import { ChevronRight, Minus, Plus, Trash } from "lucide-react";
import { useCartsStore } from "../../../store/cartsStore";
import { serverURL } from "../../../api";
import clsx from "clsx/lite";

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCartsStore();
    
  return (
    <div className={
      clsx(
        "p-4 bg-gray-800 border  rounded-lg shadow-sm md:p-6",
        item?.boughtQty > item?.quantity ? "border-red-700" : "border-gray-700",
        
      )
    }>
      <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
        <div className="shrink-0 md:order-1">
          <img
            className="object-cover h-20 rounded md:h-32"
            src={`${serverURL}/${item?.images?.[0]}`}
          />
        </div>
        <label className="sr-only">Choose quantity:</label>

        <div className="flex flex-col items-start gap-2 md:order-3">
          
          <small className="block text-green-500">{item?.quantity} items in stock</small>
        
          
          <div className="flex items-center justify-between gap-2 md:justify-end">
            <div className="flex items-center gap-2">
              <button
                className="inline-flex items-center justify-center w-5 h-5 bg-gray-700 border border-gray-600 rounded-md shrink-0 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                onClick={() => updateQuantity(item?._id, item?.boughtQty - 1, item.quantity)}
              >
                <Minus className="text-gray-300" />
              </button>
              <p>{item?.boughtQty}</p>
              <button
                className="inline-flex items-center justify-center w-5 h-5 bg-gray-700 border border-gray-600 rounded-md shrink-0 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                onClick={() => updateQuantity(item?._id, item?.boughtQty + 1, item?.quantity)}
              >
                <Plus className="text-gray-300" />
              </button>
            </div>

            <div className="text-end md:order-4 md:w-48">
              <p className="text-base font-bold text-emerald-400">
                <span className="text-xs">
                  {" "}
                  &#8358;{item?.price?.toFixed(2)} x {item?.boughtQty} ={" "}
                </span>{" "}
                &#8358;{(item?.price * item?.boughtQty)?.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full min-w-0 space-y-4 md:order-2 md:max-w-md">
          <p className="text-base font-medium text-white capitalize hover:text-emerald-400 hover:underline">
            {item?.name}
          </p>
          <p className="text-sm text-gray-400 capitalize">
            {item?.category?.name} <ChevronRight className="inline w-4 h-4" />
            {item?.brand?.name}
          </p>

          <div className="flex items-center gap-4">
            <button
              className="inline-flex items-center text-sm font-medium text-red-400 hover:text-red-300 hover:underline"
              onClick={() => removeFromCart(item?._id)}
            >
              <Trash />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CartItem;
