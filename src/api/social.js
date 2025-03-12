import api from "./api";

export const linkSocialMediaAccount = (provider, config) => {
  return api.patch(`/social/link-account/${provider}`, {}, config);
};
