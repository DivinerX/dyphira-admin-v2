import api from "./api";

export const fetchSections = (config) => {
  return api.get("/sections", config);
};

export const fetchSectionQuestions = (config) => {
  const params = config.params;
  return api.get(`/sections/${params?.sectionId}/questions`, config);
};
