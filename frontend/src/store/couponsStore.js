import toast from "react-hot-toast";
import { create } from "zustand";
import { apiClient } from "../api";

export const useCouponsStore = create((set, get) => ({
  coupon: null,
  coupons: [],
  filteredCoupons: [],
  isLoading: false,
  error: null,
  isAdded: false,
  isUpdated: false,

  setCoupons: (coupons) => set({ coupons }),

  filterCoupon: async (term) => {
    set((prevState) => ({
      filteredCoupons: prevState.coupons.filter((coupon) =>
        coupon.code.toLowerCase().includes(term)
      ),
    }));
  },

  createCoupon: async (payload) => {
    const { code, discountPercentage, maxUsage, expirationDate } = payload;

    set({ isLoading: true });
    try {
      const response = await apiClient.post("/coupons", {code, discountPercentage, maxUsage, expirationDate });
      set({
        coupon: response.data.coupon,
        isLoading: false,
        isAdded: true,
      });
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast(error.response.data.message || "Oops we could not fetch coupons");
    }
  },

  updateCoupon: async (payload, id) => {
    const { code, discountPercentage, maxUsage, expirationDate } = payload;
    set({ isLoading: true });
    try {

      const response = await apiClient.put(`/coupons/${id}`,  {code, discountPercentage, maxUsage, expirationDate});
      set({
        coupon: response.data.coupon,
        isLoading: false,
        isUpdated: true
      });
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast(error.response.data.message || "Oops we could not fetch coupons");
    }
  },

  fetchAllCoupons: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get("/coupons");
      set({
        coupons: response.data.coupons,
        filteredCoupons: response.data.coupons,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      toast(error.response.data.message || "Oops we could not load coupons");
    }
  },

  
  toggleActivation: async (couponId) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.patch(
        `/coupons/toggle-activation/${couponId}`
      );

      set((prevState) => ({
        filteredCoupons: prevState.coupons.map((coupon) =>
          coupon?._id === couponId
            ? { ...coupon, isActive: response.data.coupon.isActive }
            : coupon
        ),
        isLoading: false,
      }));
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast.error(
        error?.response?.data?.message ||
          "Coupon featured status could not be changed"
      );
    }
  },

  loadCoupons: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get("/coupons");
      set({ coupons: response.data.coupons, isLoading: true });
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast(error.response.data.message || "Oops we could not fetch coupons");
    }
  },

  getCoupon: async (id) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get(`/coupons/${id}`);
      set({ coupon: response.data.coupon, isLoading: true });
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast(error.response.data.message || "Oops we could not fetch coupons");
    }
  },

  deleteCoupon: async (couponId) => {
    set({ isLoading: true });
    try {
       await apiClient.delete(`/coupons/${couponId}`);
       set((prevState) => ({
         filteredCoupons: prevState.coupons.filter(
           (coupon) => coupon?._id !== couponId
         ),
         isLoading: false,
       }));
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast(error.response.data.message || "Oops we could not fetch coupons");
    }
  },

  resetStore: async () => {
    set({isLoading: false, isAdded: false, isUpdated: false,})
  },

}));