import toast from "react-hot-toast";
import { create } from "zustand";
import { apiClient } from "../api";

export const useProductsStore = create((set, get) => ({
  product: null,
  products: [],
  filteredProducts: [],
  isLoading: false,
  error: null,
  isAdded: false,
  isUpdated: false,

  setProducts: (products) => set({ products }),

  filterProduct: async (term) => {
    set((prevState) => ({
      filteredProducts: prevState.products.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.category.name.toLowerCase().includes(term)
      ),
    }));
  },

  createProduct: async (payload) => {
    const { name, description, category, brand, price, quantity, images } =
      payload;
    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("brand", brand);
    formData.append("price", price);
    formData.append("quantity", quantity);

    images.forEach((image) => {
      formData.append("files", image);
    });
    set({ isLoading: true });
    try {
      const response = await apiClient.post("/products", formData);
      set({
        product: response.data.product,
        isAdded: true,
        isLoading: false,
      });
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast.error(
        error.response.data.message || "Oops we could not fetch categories"
      );
    }
  },

  updateProduct: async (payload, id) => {
    const { name, description, category, brand, price, quantity, images } =
      payload;
    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("brand", brand);
    formData.append("price", price);
    formData.append("quantity", quantity);

    images?.forEach((image) => {
      formData.append("files", image);
    });
    set({ isLoading: true });
    try {
      const response = await apiClient.put(`/products/${id}`, formData);
      set({
        product: response.data.product,
        isUpdated: true,
        isLoading: false,
      });
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast.error(
        error.response.data.message || "Oops we could not fetch categories"
      );
    }
  },

  fetchAllProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get("/products");
      set({
        products: response.data.products,
        filteredProducts: response.data.products,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response.data.message || "Oops we could not load products");
    }
  },

  fetchProductByCategory: async (url) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get(url);
      set({
        products: response.data.products,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response.data.message || "Oops we could not load products");
    }
  },
  
  fetchProductById: async (productId) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get(`/products/${productId}`);
      set({
        product: response.data.product,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response.data.message || "Oops we could not load products");
    }
  },

  fetchFeaturedProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get("/products/featured-products");
      set({ products: response.data.products, isLoading: false });
      set({ isLoading: false });
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast.error(
        error.response.data.message || "Error fetching featured products"
      );
    }
  },

  toggleFeatured: async (productId) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.patch(
        `/products//toggle-featured/${productId}`
      );

      set((prevProducts) => ({
        filteredProducts: prevProducts.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: response.data.product.isFeatured }
            : product
        ),
        isLoading: false,
      }));
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast.error(
        error?.response?.data?.message ||
          "Product featured status could not be changed"
      );
    }
  },

  resetStore: async () => {
    set({ isLoading: false, isAdded: false, isUpdated: false });
  },
}));