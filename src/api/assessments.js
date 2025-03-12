import api from "./api";

export const createAssessment = (data, config) => {
  return api.post("/assessments", data, config);
};

export const updateAssessment = (data, config) => {
  return api.patch("/assessments", data, config);
};
