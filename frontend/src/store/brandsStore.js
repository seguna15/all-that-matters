import toast from "react-hot-toast";
import { create } from "zustand";
import { apiClient } from "../api";

export const useBrandsStore = create((set, get) => ({
  brand: null,
  brands: [],
  filteredBrands: [],
  isLoading: false,
  error: null,
  isAdded: false,
  isUpdated: false,

  setBrands: (brands) => set({ brands }),

  filterBrand: async (term) => {
    set((prevState) => ({
      filteredBrands: prevState.brands.filter((brand) =>
        brand.name.toLowerCase().includes(term)
      ),
    }));
  },

  createBrand: async (payload) => {
    const { name } = payload;

    set({ isLoading: true });
    try {
      const response = await apiClient.post("/brands", { name });
      set({
        brand: response.data.brand,
        isLoading: false,
        isAdded: true,
      });
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast(error.response.data.message || "Oops we could not fetch brands");
    }
  },

  updateBrand: async (name, id) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.put(`/brands/${id}`,  {name});
      set({
        brand: response.data.brand,
        isLoading: false,
        isUpdated: true
      });
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast(error.response.data.message || "Oops we could not fetch brands");
    }
  },

  fetchAllBrands: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get("/brands");
      set({
        brands: response.data.brands,
        filteredBrands: response.data.brands,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      toast(error.response.data.message || "Oops we could not load brands");
    }
  },

  fetchFeaturedBrands: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get("/brands/featured-brands");
      set({ brands: response.data.brands, isLoading: false });
      set({ isLoading: false });
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast.error(
        error.response.data.message || "Error fetching featured brands"
      );
    }
  },

  toggleFeatured: async (brandId) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.patch(
        `/brands//toggle-featured/${brandId}`
      );

      set((prevBrands) => ({
        brands: prevBrands?.brands?.map((brand) =>
          brand._id === brandId
            ? { ...brand, isFeatured: response.data.brand.isFeatured }
            : brand
        ),
        isLoading: false,
      }));
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast.error(
        error?.response?.data?.message ||
          "Brand featured status could not be changed"
      );
    }
  },

  loadBrands: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get("/brands");
      set({ brands: response.data.brands, isLoading: true });
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast(error.response.data.message || "Oops we could not fetch brands");
    }
  },

  getBrand: async (id) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get(`/brands/${id}`);
      set({ brand: response.data.brand, isLoading: true });
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast(error.response.data.message || "Oops we could not fetch brands");
    }
  },

  resetStore: async () => {
    set({isLoading: false, isAdded: false, isUpdated: false,})
  },

}));