import axios from "axios";

export const serverURL = "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:8000/api/v1"
      : "yourdomain/api/v1",
  withCredentials: true,
  // timeout: 10000,
});

apiClient.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    const prevRequest = error?.config;
    if (error?.response?.status === 401 && !prevRequest?.sent) {
      prevRequest.sent = true;
      const response = await apiClient.post(
        "/auth/refresh",
        {},
       
      );
      if (response.status === 200) {
        return axios(prevRequest);
      }
    }

    if (error?.response?.status === 403) {
      
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);
