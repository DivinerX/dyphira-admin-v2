import api from "./api";

export const createAnswer = (data, config) => {
  return api.post("/answers", data, config);
};
