import api from "../lib/axios";
import Cookies from "js-cookie";
import { useAuthStore } from "../store/auth";
import type { LoginDto, RegisterDto } from "@/types/api";

export const authApi = {
  register: (dto: RegisterDto) => api.post("/auth/register", dto),

  login: async (dto: LoginDto) => {
    const res = await api.post("/auth/login", dto);

    useAuthStore
      .getState()
      .setAuth(res.data.user, res.data.access_token, res.data.refresh_token);

    return res.data;
  },

  logout: async () => {
    const rToken = Cookies.get("refresh_token");
    await api.post("/auth/logout", { refreshToken: rToken });
    useAuthStore.getState().logout();
  },

  refresh: async () => api.post("/auth/refresh"),
};
