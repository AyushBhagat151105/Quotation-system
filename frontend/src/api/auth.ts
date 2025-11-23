import api from "../lib/axios";
import Cookies from "js-cookie";
import { useAuthStore } from "../store/auth";
import { toast } from "sonner";
import type { LoginDto, RegisterDto } from "@/types/api";

export const authApi = {
  register: async (dto: RegisterDto) => {
    const res = await api.post("/auth/register", dto);
    toast.success("Account created successfully!");
    return res.data;
  },

  login: async (dto: LoginDto) => {
    const res = await api.post("/auth/login", dto);

    useAuthStore
      .getState()
      .setAuth(res.data.user, res.data.access_token, res.data.refresh_token);

    toast.success("Logged in successfully!");

    return res.data;
  },

  logout: async () => {
    const rToken = Cookies.get("refresh_token");
    await api.post("/auth/logout", { refreshToken: rToken });

    useAuthStore.getState().logout();
    toast.success("Logged out!");
  },

  refresh: async () => api.post("/auth/refresh"),
};
