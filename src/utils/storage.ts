const STORAGE_PREFIX = "session_";
const ACCESS_TOKEN_KEY = `${STORAGE_PREFIX}accessToken`;
const REFRESH_TOKEN_KEY = `${STORAGE_PREFIX}refreshToken`;

const storage = {
  getAccessToken: () => {
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  setAccessToken: (accessToken: string) => {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  },
  clearAccessToken: () => {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken: () => {
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setRefreshToken: (refreshToken: string) => {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clearRefreshToken: () => {
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  clearTokens: () => {
    window.localStorage.clear();
  },
};

export default storage;
