import toast from "react-hot-toast";
import { create } from "zustand";
import { apiClient } from "../api";

export const useUsersStore = create((set, get) => ({
  users: [],
  filteredUsers: [],
  isLoading: false,
  error: null,
  isAdded: false,
  isUpdated: false,

  setUsers: (users) => set({ users }),

  filterUser: async (term) => {
    set((prevState) => ({
      filteredUsers: prevState.users.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      ),
    }));
  },

  fetchAllUsers: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get("/users/customers");
      set({
        users: response.data.customers,
        filteredUsers: response.data.customers,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      toast(error.response.data.message || "Oops we could not load users");
    }
  },

  toggleUserRole: async (userId) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.patch(`/users/toggle/role/${userId}`);
      set((prevProducts) => ({
        filteredUsers: prevProducts.filteredUsers.map((user) =>
          user._id === userId
            ? { ...user, isAdmin: response.data.user.isAdmin }
            : user
        ),
        users: prevProducts.users.map((user) =>
          user._id === userId
            ? { ...user, isAdmin: response.data.user.isAdmin }
            : user
        ),
        isLoading: false,
      }));
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast(error.response.data.message || "Oops we could not fetch orders");
    }
  },

  toggleUserStatus: async (userId) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.patch(`/users/toggle/status/${userId}`);
      set((prevProducts) => ({
        filteredUsers: prevProducts.filteredUsers.map((user) =>
          user._id === userId
            ? { ...user, isVerified: response.data.user.isVerified }
            : user
        ),
        users: prevProducts.users.map((user) =>
          user._id === userId
            ? { ...user, isVerified: response.data.user.isVerified }
            : user
        ),
        isLoading: false,
      }));
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast(error.response.data.message || "Oops we could not fetch orders");
    }
  },

  resetStore: async () => {
    set({ isLoading: false, isAdded: false, isUpdated: false });
  },
}));