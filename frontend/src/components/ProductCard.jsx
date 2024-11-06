import toast from "react-hot-toast";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { useCartsStore } from "../store/cartsStore";
import { useAuthStore } from "../store/authStore";
import { serverURL } from "../api";
import { Link } from "react-router-dom";


const ProductCard = ({ product }) => {
  const { user } = useAuthStore();
  const { addToCart } = useCartsStore();
  
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
    <div className="relative flex flex-col w-full overflow-hidden border border-gray-700 rounded-lg shadow-lg">
      <div className="relative flex mx-3 mt-3 overflow-hidden h-60 rounded-xl">
        <img
          className="object-cover w-full"
          src={`${serverURL}/${product?.images[0]}`}
          alt="product image"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      </div>

      <div className="px-5 pb-5 mt-4">
        <h5 className="text-xl font-semibold tracking-tight text-white capitalize">
          {product.name}
        </h5>
        <div className="flex items-center justify-between mt-2 mb-5">
          <p>
            <span className="text-2xl font-bold md:text-3xl text-emerald-400">
              &#8358;{product.price?.toFixed(2)}
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
          <Link to={`/product/${product?._id}`} className="transition-all hover:scale-110 hover:translate-x-2">
            <ArrowRight/>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;