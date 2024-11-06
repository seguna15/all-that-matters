import toast from "react-hot-toast";
import { create } from "zustand"


export const useCartsStore = create((set, get) => ({
    cartItems: [],
    cartLoading: false,

    addToCart: async (productId) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.post('/cart', {productId});
          set({
            cartItems: response.data.cartItems,
            isLoading: false,
          });
          toast.su
        } catch (error) {
          set({ isLoading: false });
          toast.error(
            error.response.data.message || "Oops we could not load products"
          );
        }
    },

    
}))