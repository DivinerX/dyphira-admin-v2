import storage from "@/utils/storage";
import api from "./api";

export const login = (credientials: any, config: any) => {
  return api.post("/auth/admin", credientials, config);
};

export const fetchUser = (config: any) => {
  return api.get("/users/me", config);
};

export const register = (data: any, config: any) => {
  return api.post("/users", data, config);
};

export const logout = () => {
  storage.clearTokens();
};
