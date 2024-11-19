import toast from "react-hot-toast";
import { create } from "zustand";
import { apiClient } from "../api";

export const useOrdersStore = create                      ((set, get) => ({
  order: null,
  orders: [],
  filteredOrders: [],
  isLoading: false,
  error: null,
  isAdded: false,
  isUpdated: false,

  setOrders: (orders) => set({ orders }),

  filterOrder: async (term) => {
    set((prevState) => ({
      filteredOrders: prevState.orders.filter(
        (order) =>
          order?.paymentSessionID.toLowerCase().includes(term) ||
          order?.user?.email?.toLowerCase().includes(term)
      ),
    }));
  },

  updateOrder: async (name, id) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.put(`/orders/${id}`,  {name});
      set({
        order: response.data.order,
        isLoading: false,
        isUpdated: true
      });
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast(error.response.data.message || "Oops we could not fetch orders");
    }
  },
 
  updateOrderShippingStatus: async (orderStatus, orderId) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.patch(
        `/orders/update-status/shipping/${orderId}`,
        { orderStatus }
      );
      set((prevProducts) => ({
        filteredOrders: prevProducts.filteredOrders.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus: response.data.order.orderStatus }
            : order
        ),
        orders: prevProducts.orders.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus: response.data.order.orderStatus }
            : order
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

  fetchAllOrders: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get("/orders");
      set({
        orders: response.data.orders,
        filteredOrders: response.data.orders,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      toast(error.response.data.message || "Oops we could not load orders");
    }
  },

  fetchCustomerOrders: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get("/orders/customer-orders");
      set({
        orders: response.data.orders,
        filteredOrders: response.data.orders,
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast(error.response.data.message || "Oops we could not fetch orders");
    }
  },

  getOrder: async (id) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get(`/orders/get/${id}`);

      set({ order: response.data.order, isLoading: false });
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast(error.response.data.message || "Oops we could not fetch orders");
    }
  },

  resetStore: async () => {
    set({isLoading: false, isAdded: false, isUpdated: false,})
  },

}));