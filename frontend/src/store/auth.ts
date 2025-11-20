import { create } from "zustand";
import Cookies from "js-cookie";
import type { UserProfile } from "@/types/api";

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;

  setAuth: (u: UserProfile, aToken: string, rToken: string) => void;
  setAccessToken: (t: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,

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
