import axios from "axios";
import storage from "../utils/storage";
import axiosInstance, { axiosParams } from "../lib/axios";
import { toast } from "react-toastify";

const handleAuthError = (message) => {
  toast.dismiss();
  toast.error(message, {
    theme: "dark",
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    pauseOnHover: false,
    draggable: true,
  });

  setTimeout(() => {
    storage.clearTokens();
    window.location.href = "/";
  }, 5000);
};

// Function to refresh the access token using the refresh token
const refreshAccessToken = async () => {
  const refreshToken = storage.getRefreshToken();
  try {
    const response = await axios.post(
      `${axiosParams.baseURL}/auth/refresh-token`,
      { refreshToken },
    );
    const newAccessToken = response.data.accessToken;
    const newRefreshToken = response.data.refreshToken;

    storage.setAccessToken(newAccessToken);
    storage.setRefreshToken(newRefreshToken);

    return newAccessToken;
  } catch (error) {
    console.error("refresh token error", error);
    throw error;
  }
};

// Add an interceptor to add the access token to the headers of each request
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get the current access token from storage
    const accessToken = storage.getAccessToken();
    if (accessToken) {
      // Add the access token to the headers of the request
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let refreshSubscribers = [];

const addSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

//Add an interceptor to refresh the access token if it is expired
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (error.response.data.message === "Invalid admin credentials.") {
        // Do not retry login requests
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          addSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();
        onRefreshed(newAccessToken);
        isRefreshing = false;
        // Retry the request with the new access token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        handleAuthError("Your session has expired. Please log in again.");
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

const didAbort = (error) => axios.isCancel(error);

const getCancelSource = () => axios.CancelToken.source();

export const isApiError = (error) => {
  return axios.isAxiosError(error);
};

const withAbort = (fn) => {
  const executor = async (...args) => {
    const originalConfig = args[args.length - 1];
    // Extract abort property from the config
    const { abort, ...config } = originalConfig;

    // Create cancel token and abort method only if abort
    // function was passed
    if (typeof abort === "function") {
      const { cancel, token } = getCancelSource();
      config.cancelToken = token;
      abort(cancel);
    }

    try {
      if (args.length > 2) {
        const [url, body] = args;
        return await fn(url, body, config);
      } else {
        const [url] = args;
        return await fn(url, config);
      }
    } catch (error) {
      // Add "aborted" property to the error if the request was cancelled
      if (didAbort(error)) {
        error.aborted = true;
      }

      throw error;
    }
  };

  return executor;
};

const withLogger = async (promise) =>
  promise.catch((error) => {
    /*
    Always log errors in dev environment
    if (pimport.meta.NODE_ENV !== 'development') throw error      
  */
    // Log error only if VUE_APP_DEBUG_API env is set to true
    if (!import.meta.env.REACT_APP_DEBUG_API) throw error;
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest
      // in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    console.log(error.config);

    throw error;
  });

// Main api function
const api = (axios) => {
  return {
    get: (url, config = {}) => withLogger(withAbort(axios.get)(url, config)),
    delete: (url, config = {}) =>
      withLogger(withAbort(axios.delete)(url, config)),
    post: (url, body, config = {}) =>
      withLogger(withAbort(axios.post)(url, body, config)),
    patch: (url, body, config = {}) =>
      withLogger(withAbort(axios.patch)(url, body, config)),
    put: (url, body, config = {}) =>
      withLogger(withAbort(axios.put)(url, body, config)),
  };
};

export default api(axiosInstance);
