import api from "./api";

export const createAssessment = (data: any, config: any) => {
  return api.post("/assessments", data, config);
};

export const updateAssessment = (data: any, config: any) => {
  return api.patch("/assessments", data, config);
};
