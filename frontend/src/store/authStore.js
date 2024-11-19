import {create} from "zustand";
import { apiClient } from "../api";
import toast from "react-hot-toast"

export const useAuthStore = create((set, get) => ({
  user: localStorage?.getItem("userInfo")
    ? JSON.parse(localStorage?.getItem("userInfo"))
    : null,
  error: null,
  isLoading: false,
  checkingAuth: true,
  isGoogleLoading: false,
  userProfile: null,

  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post("/auth/register", {
        name,
        email,
        password,
      });
      set({ isLoading: false });
      toast.success(response.data.message);
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });
      toast.error(error.response.data.message || "Error signing up");
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post("auth/verify-email", { code });
      set({ isLoading: false });
      toast.success(response.data.message);
    } catch (error) {
      set({
        error: error.response.data.message || "Error verifying email",
        isLoading: false,
      });
      toast.error(error.response.data.message || "Error verifying email");
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      set({
        user: JSON.parse(localStorage?.getItem("userInfo")),
        isLoading: false,
      });

      toast.success(response.data.message);
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });
      toast.error(error.response.data.message || "Error signing up");
      throw error;
    }
  },

  googleLogin: async () => {
    set({ isGoogleLoading: true, error: null });
    try {
      const { data } = await apiClient.post("/auth/google-request");
      set({ isGoogleLoading: false, error: null });
      window.location.href = data?.url;
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing up with google",
        isGoogleLoading: false,
      });
      toast.error(
        error.response.data.message || "Error signing up with google"
      );
      throw error;
    }
  },

  googleAuthSuccessful: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post("/auth/google-auth-successful", {
        email,
      });
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      set({
        user: JSON.parse(localStorage?.getItem("userInfo")),
        isLoading: false,
      });
      toast.success(response.data.message);
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });
      toast.error(error.response.data.message || "Error signing up");
      throw error;
    }
  },

  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get("/users/get-user-profile");
      set({ userProfile: response.data.user, isLoading: false });
      toast.success(response.data.message);
    } catch (error) {
      set({
        error: error.response.data.message || "Error fetching data",
        isLoading: false,
      });
      toast.error(error.response.data.message || "Error fetching data");
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post("/auth/logout");
      localStorage.removeItem("userInfo");
      set({ user: null, isLoading: false });
      toast.success(response.data.message);
    } catch (error) {
      set({
        error: error?.response?.data?.message || "Error fetching data",
        isLoading: false,
      });
      toast.error(error?.response?.data?.message || "Error fetching data");
    }
  },

  /* checkAuth: async () => {
    const userAuth = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;
    set({ user: userAuth, checkingAuth: false});
  }, */

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post("/auth/forgot-password", { email });
      set({ isLoading: false });
      toast.success(response.data.message);
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response.data.message || "Error sending reset password email",
      });
      toast.error(
        error.response.data.message || "Error sending reset password email"
      );
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    if (password !== confirmPassword) {
      set({ isLoading: false });
      return toast.error("Passwords do not match");
    }
    try {
      const response = await apiClient.post(`/auth/reset-password/${token}`, {
        password,
      });
      set({ isLoading: false });
      toast.success(response.data.message);
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response.data.message || "Error sending reset password email",
      });
      toast.error(
        error.response.data.message || "Error sending reset password email"
      );
      throw error;
    }
  },
}));

