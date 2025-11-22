import { create } from "zustand";
import Cookies from "js-cookie";
import type { UserProfile } from "@/types/api";
import api from "@/lib/axios";

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;

  initAuth: () => Promise<void>;
  setAuth: (u: UserProfile, aToken: string, rToken: string) => void;
  setAccessToken: (t: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,

  initAuth: async () => {
    const refreshToken = Cookies.get("refresh_token");
    if (!refreshToken) return;

    try {
      const refreshRes = await api.post("/auth/refresh", {
        refreshToken,
      });

      const accessToken = refreshRes.data.access_token;
      set({ accessToken });

      const profileRes = await api.get("/users/me");
      set({ user: profileRes.data });
    } catch (err) {
      Cookies.remove("refresh_token");
      set({ user: null, accessToken: null });
    }
  },

  setAuth: (user, accessToken, refreshToken) => {
    set({ user, accessToken });
    Cookies.set("refresh_token", refreshToken, {
      expires: 7,
      secure: true,
      sameSite: "strict",
    });
  },

  setAccessToken: (token) => set({ accessToken: token }),

  logout: () => {
    Cookies.remove("refresh_token");
    set({ user: null, accessToken: null });
  },
}));
