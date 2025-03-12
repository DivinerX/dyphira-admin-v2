import api from "./api";

export const uploadRecordedVideo = (data, config) => {
  return api.post(`/chat/uploads`, data, config);
};
