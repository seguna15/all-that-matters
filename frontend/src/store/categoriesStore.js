import toast from "react-hot-toast";
import { create } from "zustand";
import { apiClient } from "../api";

export const useCategoriesStore = create((set, get) => ({
  category: null,
  categories: [],
  filteredCategories: [],
  isLoading: false,
  isUpdated: false,
  isAdded: true,
  error: null,

  setCategories: (categories) => set({ categories }),

  filterCategory: async (term) => {
    set((prevState) => ({
      filteredCategories: prevState.categories.filter((category) =>
        category.name.toLowerCase().includes(term)
      ),
    }));
  },

  createCategory: async (payload) => {
    const { name, images } = payload;
    const formData = new FormData();

    formData.append("name", name);

    images.forEach((image) => {
      formData.append("file", image);
    });

    set({ isLoading: true });
    try {
      const response = await apiClient.post("/categories", formData);
      set({
        category: response.data.category,
        isLoading: false,
        isAdded: true,
      });
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast(
        error.response.data.message || "Oops we could not fetch categories"
      );
    }
  },

  updateCategory: async (payload, id) => {
    const { name, images } = payload;
    const formData = new FormData();

    formData.append("name", name);

    images?.forEach((image) => {
      formData.append("file", image);
    });

    set({ isLoading: true });
    try {
      const response = await apiClient.put(`/categories/${id}`, formData);
      set({
        category: response.data.category,
        isLoading: false,
        isUpdated: true,
      });
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast(
        error.response.data.message || "Oops we could not fetch categories"
      );
    }
  },
 
  fetchAllCategories: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get("/categories");
      set({
        categories: response.data.categories,
        filteredCategories: response.data.categories,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      toast(error.response.data.message || "Oops we could not load categories");
    }
  },

  fetchFeaturedCategories: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get("/categories/featured-categories");
      set({ categories: response.data.categories, isLoading: false });
      set({ isLoading: false });
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast.error(
        error.response.data.message || "Error fetching featured categories"
      );
    }
  },

  toggleFeatured: async (categoryId) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.patch(
        `/categories//toggle-featured/${categoryId}`
      );

      set((prevCategories) => ({
        categories: prevCategories.categories.map((category) =>
          category._id === categoryId
            ? { ...category, isFeatured: response.data.category.isFeatured }
            : category
        ),
        isLoading: false,
      }));
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast.error(
        error?.response?.data?.message ||
          "Category featured status could not be changed"
      );
    }
  },

  loadCategories: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get("/categories");
      set({ categories: response.data.categories });
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast(
        error.response.data.message || "Oops we could not fetch categories"
      );
    }
  },

  resetStore: async () => {
    set({ isLoading: false, isAdded: false, isUpdated: false });
  },
}));