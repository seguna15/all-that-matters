import toast from "react-hot-toast";
import { create } from "zustand";
import { apiClient } from "../api";

export const useUnitsStore = create((set, get) => ({
  unit: null,
  units: [],
  filteredUnits: [],
  isLoading: false,
  error: null,
  isAdded: false,
  isUpdated: false,

  setUnits: (units) => set({ units }),

  filterUnit: async (term) => {
    set((prevState) => ({
      filteredUnits: prevState.units.filter((unit) =>
        unit.name.toLowerCase().includes(term)
      ),
    }));
  },

  createUnit: async (payload) => {
    const { name } = payload;

    set({ isLoading: true });
    try {
      const response = await apiClient.post("/units", { name });
      set({
        unit: response.data.unit,
        isLoading: false,
        isAdded: true,
      });
      toast.success(response?.data?.message);
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast(error?.response?.data?.message || "Oops we could not fetch units");
    }
  },

  updateUnit: async (name, id) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.put(`/units/${id}`,  {name});
      set({
        unit: response.data.unit,
        isLoading: false,
        isUpdated: true
      });
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast(error?.response?.data?.message || "Oops we could not fetch units");
    }
  },

  fetchAllUnits: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get("/units");
      set({
        units: response.data.units,
        filteredUnits: response.data.units,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      toast(error?.response?.data?.message || "Oops we could not load units");
    }
  },

  fetchFeaturedUnits: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get("/units/featured-units");
      set({ units: response.data.units, isLoading: false });
      set({ isLoading: false });
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast.error(
        error?.response?.data?.message || "Error fetching featured units"
      );
    }
  },

  toggleFeatured: async (unitId) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.patch(
        `/units//toggle-featured/${unitId}`
      );

      set((prevUnits) => ({
        units: prevUnits.units.map((unit) =>
          unit._id === unitId
            ? { ...unit, isFeatured: response.data.unit.isFeatured }
            : unit
        ),
        isLoading: false,
      }));
      toast.success(response?.data?.message);
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast.error(
        error?.response?.data?.message ||
          "Unit featured status could not be changed"
      );
    }
  },

  loadUnits: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get("/units");
      set({ units: response.data.units, isLoading: true });
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast(error?.response?.data?.message || "Oops we could not fetch units");
    }
  },

  getUnit: async (id) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get(`/units/${id}`);
      set({ unit: response.data.unit, isLoading: true });
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast(error?.response?.data?.message || "Oops we could not fetch units");
    }
  },

  resetStore: async () => {
    set({isLoading: false, isAdded: false, isUpdated: false,})
  },

}));