import axios from "axios";
import { toast } from "react-toastify";
import storage from "src/utils/storage";
import { getNewAccessToken } from "./requests";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const accessToken = storage.getAccessToken();

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

const errorToast = (errorMessage) =>
  toast.warning(errorMessage, {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });

const refreshToken = async () => {
  if (!isRefreshing) {
    isRefreshing = true;
    try {
      const refreshToken = storage.getRefreshToken();
      const newAccessToken = await getNewAccessToken(refreshToken);
      storage.setAccessToken(newAccessToken);
      isRefreshing = false;
      return newAccessToken;
    } catch (error) {
      console.error(error);
      isRefreshing = false;
      return Promise.reject(error);
    }
  } else {
    return refreshPromise;
  }
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "jwt expired" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      refreshPromise = refreshToken();

      try {
        const newAccessToken = await refreshPromise;
        storage.setAccessToken(newAccessToken);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error(refreshError);
        return Promise.reject(refreshError);
      } finally {
        refreshPromise = null;
      }
    }

    if (error.response.status === 400) {
      errorToast(error.response.data.message);
    }

    if (
      error.response.status === 302 &&
      error.response.data.message === "Staff already exists."
    ) {
      errorToast(error.response.data.message);
    }

    return Promise.reject(error);
  }
);

export default api;
