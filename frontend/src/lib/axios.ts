import axios from "axios";
import Cookies from "js-cookie";
import { useAuthStore } from "../store/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// -------- Attach Bearer token --------
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// -------- Auto Refresh Logic --------
let refreshing = false;
let queue: any[] = [];

api.interceptors.response.use(
  (res) => res,

  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (refreshing) {
        return new Promise((resolve) => {
          queue.push(resolve);
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }

      refreshing = true;

      try {
        const rToken = Cookies.get("refresh_token");
        if (!rToken) throw error;

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refreshToken: rToken },
          { withCredentials: true }
        );

        const newToken = res.data.access_token;
        useAuthStore.getState().setAccessToken(newToken);

        queue.forEach((cb) => cb(newToken));
        queue = [];
        refreshing = false;

        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (err) {
        refreshing = false;
        useAuthStore.getState().logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
