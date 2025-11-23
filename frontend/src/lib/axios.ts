import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  withCredentials: true,
});

// ------------------------------
// ADD ACCESS TOKEN
// ------------------------------
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ------------------------------
// GLOBAL RESPONSE HANDLER
// ------------------------------
api.interceptors.response.use(
  (res) => {
    if (res.data?.message) {
      toast.success(res.data.message);
    }
    return res;
  },

  async (error) => {
    const status = error?.response?.status;
    const msg =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Something went wrong";

    if (status === 401) {
      const refreshToken = Cookies.get("refresh_token");

      if (!refreshToken) {
        toast.error("Session expired. Please login again.");
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      try {
        const refreshRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        useAuthStore.getState().setAccessToken(refreshRes.data.access_token);

        error.config.headers.Authorization = `Bearer ${refreshRes.data.access_token}`;
        return api.request(error.config);
      } catch {
        toast.error("Session expired. Please login again.");
        useAuthStore.getState().logout();
      }
    }

    toast.error(msg);
    return Promise.reject(error);
  }
);

export default api;
