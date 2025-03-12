import api from "./api";

export const login = (credentials: { email: string; password: string }, config = {}) => {
  return api.post("/auth/login", credentials, config);
};

export const register = (credentials: { email: string; password: string }, config = {}) => {
  return api.post("/auth/register", credentials, config);
};

export const logout = () => {
  return api.post("/auth/logout", {});
};

export const fetchUser = (config = {}) => {
  return api.get("/auth/me", config);
};
