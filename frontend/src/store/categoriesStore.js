import toast from "react-hot-toast";
import { create } from "zustand";
import { apiClient } from "../api";

export const useCategoriesStore = create((set, get) => ({
    categories: null,
    isLoading: false,
    error: null,

    loadCategories: async () => {

        set({isLoading: true})
        try {
            const response = apiClient.get('/categories');
            set({categories: (await response).data.categories})
        } catch (error) {
            console.log(error)
            set({isLoading: false})
            toast(error.response.data.message || "Oops we could not fetch categories")
        }
    }
    
}))