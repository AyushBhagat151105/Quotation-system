import api from "../lib/axios";

export const userApi = {
  me: async () => {
    const res = await api.get("/users/me");
    return res.data;
  },
};
