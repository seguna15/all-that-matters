import toast from "react-hot-toast";
import { ArrowRight, Loader2, ShoppingCart } from "lucide-react";
import { useCartsStore } from "../store/cartsStore";
import { useAuthStore } from "../store/authStore";
import { serverURL } from "../api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Spinner } from "./Spinner";


const ProductCard = ({ product }) => {
  const { user } = useAuthStore();
  const { isLoading: cartLoading, addToCart } = useCartsStore();
 
  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add products to cart", { id: "login" });
      return;
    } else {
      // add to cart
      addToCart(product);
    }
  };

  return (
    <>
      <div className="w-[260px] h-[300px] relative bg-gray-50 flex flex-col  bg-card  hover:bg-white items-center justify-center gap-4 rounded-xl border border-gray-200  transition-transform duration-500">
        <Link to={`/product/${product?._id}`}>
          <ArrowRight className="absolute top-0 right-0 z-10 w-10 h-10 px-2 text-white transition-all translate-x-2 -translate-y-1 shadow-2xl bg-emerald-600 rounded-tr-xl hover hover:scale-110 hover:translate-x-2" />
        </Link>
        <div className="flex flex-col items-center justify-between w-full h-full py-4 ">
          <motion.img
            whileHover={{ scale: 1.2 }}
            src={`${serverURL}/${product?.images?.[0]}`}
            alt={product?.name}
            className="w-[130px] h-[130px] max-w-[120px] rounded-full drop-shadow-2xl mb-4"
          />
          <div className="flex flex-col items-center justify-center w-full gap-1 px-4">
            <div className="flex flex-col items-center ">
              <h2 className="font-semibold text-gray-900 capitalize text-md">
                {product?.name}
              </h2>
              <p className="mb-2 text-gray-600">{product?.category?.name}</p>
            </div>

            <div className="flex flex-row items-center justify-between w-full">
              <p className="font-semibold text-gray-600 text-md text-headingColor">
                <span className="text-yellow-900 ">&#8358;</span>
                {product?.price?.toFixed(2)}
              </p>
              
                <button
                  disabled={product?.quantity < 1 || cartLoading ? true : false}
                  onClick={handleAddToCart}
                  className="relative px-4 py-2 text-white rounded bg-emerald-600 disabled:bg-gray-500 group"
                >
                  {cartLoading ? (
                    <Loader2 />
                  ) : (
                    <>
                      {" "}
                      <ShoppingCart
                        size={"20"}
                        className="text-white absolute top-[9px] left-[45px] invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      <span className="group-hover:invisible ">
                        Add to Cart
                      </span>
                    </>
                  )}
                </button>
            
            </div>
          </div>
        </div>
      </div>

      {/*  <div className="relative flex flex-col w-full overflow-hidden transition-all duration-300 border-gray-700 rounded-lg shadow-lg group">
        <div className="relative flex mx-3 mt-3 overflow-hidden h-60 rounded-xl">
          <img
            className="object-cover w-full group-hover:scale-105"
            src={`${serverURL}/${product?.images?.[0]}`}
            alt="product image"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20" />
        </div>

        <div className="px-5 pb-5 mt-4">
          <h5 className="text-xl font-semibold tracking-tight text-white capitalize">
            {product?.name}
          </h5>
          <div className="flex items-center justify-between mt-2 mb-5">
            <p>
              <span className="text-2xl font-bold md:text-3xl text-emerald-400">
                &#8358;{product?.price?.toFixed(2)}
              </span>
            </p>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium
					 text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={22} className="mr-2" />
              Add to cart
            </button>
            <Link
              to={`/product/${product?._id}`}
              className="flex items-center justify-center rounded-lg bg-yellow-500 px-5 py-2.5 text-center text-sm font-medium
					 text-white hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all hover:scale-110 hover:translate-x-2"
            >
              <ArrowRight />
            </Link>
          </div>
        </div>
      </div> */}
    </>
  );
};
export default ProductCard;
