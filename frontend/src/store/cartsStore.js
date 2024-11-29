import toast from "react-hot-toast";
import { create } from "zustand"
import { apiClient } from "../api";


export const useCartsStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subTotal: 0,
  isLoading: false,
  isCouponApplied: false,

  addToCart: async (product) => {
    set({ isLoading: true });
    try {
      await apiClient.post("/carts", { productId: product._id });
      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id
        );
        const newCart = existingItem
          ? prevState.cart?.map((item) =>
              item?._id === product?._id
                ? { ...item, boughtQty: item.boughtQty + 1 }
                : item
            )
          : [...prevState.cart, { ...product, boughtQty: 1 }];
        return { cart: newCart, isLoading: false };
      });
      get().calculateTotals();
    } catch (error) {
      set({ isLoading: false });
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Oops we could not load products"
      );
    }
  },

  getCartItems: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get("/carts");

      set({
        cart: response.data.cart,
        isLoading: false,
      });
      get().calculateTotals();
    } catch (error) {
      set({ isLoading: false, cart: [] });
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Oops we could not load cart items"
      );
    }
  },

  removeFromCart: async (productId) => {
    try {
      await apiClient.delete(`/carts/${productId}`);
      set((prevState) => ({
        cart: prevState.cart.filter((item) => item._id !== productId),
      }));
      get().calculateTotals();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Oops we could not load cart items"
      );
    }
  },

  updateQuantity: async (productId, boughtQuantity, quantity) => {
    try {
      if (boughtQuantity === 0) {
        get().removeFromCart(productId);
        return;
      }

      if (quantity < boughtQuantity) {
        toast.error("You cannot exceed available quantity");
        return;
      }
      await apiClient.patch(`/carts/${productId}`, { boughtQuantity });
      set((prevState) => ({
        cart: prevState?.cart?.map((item) =>
          item?._id === productId
            ? { ...item, boughtQty: boughtQuantity }
            : item
        ),
      }));
      get().calculateTotals();
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Oops we could not load cart items"
      );
    }
  },

  calculateTotals: () => {
    const { cart, coupon } = get();
    const subTotal = cart.reduce(
      (sum, item) => sum + item.price * item.boughtQty,
      0
    );
    let total = subTotal;
    if (coupon) {
      
      const discount = subTotal * (coupon.discountPercentage / 100);
      total = subTotal - discount;
    }

    set({ subTotal, total });
  },

  applyCoupon: async (code) => {
    try {
      const response = await apiClient.post("/coupons/validate", { code });
      set({ coupon: response.data.coupon, isCouponApplied: true });
      get().calculateTotals();
      toast.success("Coupon applied successfully");
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    }
  },

  getMyCoupon: async () => {
    try {
      const response = await apiClient.get("coupons/active");
      set({ coupon: response?.data?.coupon});
      
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "You have no coupons available"
      );
    }
  },

  removeCoupon: async () => {
    set({ coupon: null, isCouponApplied: false });
    get().calculateTotals();
    toast.success("Coupon removed");
  },
}));