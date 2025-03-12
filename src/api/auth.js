import storage from "../utils/storage";
import api from "./api";

export const login = (credientials, config) => {
  return api.post("/auth/admin", credientials, config);
};

export const fetchUser = (config) => {
  return api.get("/users/me", config);
};

export const register = (data, config) => {
  return api.post("/users", data, config);
};

export const logout = () => {
  storage.clearTokens();
};
