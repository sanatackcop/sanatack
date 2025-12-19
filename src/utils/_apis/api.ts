import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import Storage from "@/lib/Storage";

export const baseURL = import.meta.env.VITE_REACT_APP_BASEURL;

let logoutHandler: (() => void) | null = null;

export const registerLogout = (handler: () => void) => {
  logoutHandler = handler;
};

const forceLogout = () => {
  if (logoutHandler) logoutHandler();
};

const getAccessToken = () =>
  Storage.get("access_token") || Storage.get("accessToken") || "";

const getRefreshToken = () =>
  Storage.get("refresh_token") || Storage.get("refreshToken") || "";

const saveTokens = (accessToken: string, refreshToken: string) => {
  Storage.set("access_token", accessToken);
  Storage.set("accessToken", accessToken);
  Storage.set("refresh_token", refreshToken);
  Storage.set("refreshToken", refreshToken);
};

const baseApi = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

const refreshApi = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

baseApi.interceptors.request.use(
  (config: any) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const auth = Storage.get("auth");
    if (auth?.user?.id) {
      config.headers.user_id = auth.user.id;
      config.params = {
        ...(config.params || {}),
        user_id: auth.user.id,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

const resolveQueue = (token: string) => {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
};

baseApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      forceLogout();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshQueue.push((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(baseApi(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) throw new Error("No refresh token");

      const { data }: any = await refreshApi.post("/auth/refresh", {
        refresh_token: refreshToken,
      });

      const newAccessToken = data.accessToken || data.access_token;
      const newRefreshToken = data.refreshToken || data.refresh_token;

      if (!newAccessToken || !newRefreshToken) {
        throw new Error("Invalid refresh response");
      }

      saveTokens(newAccessToken, newRefreshToken);

      resolveQueue(newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return baseApi(originalRequest);
    } catch (refreshError) {
      forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export interface CustomError {
  error: {
    type: string;
    body: string;
  };
}

const Api = async <T = unknown>(
  config: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  try {
    return await baseApi(config);
  } catch (err: any) {
    const errorData = err?.response?.data;

    if (errorData && typeof errorData === "object") {
      if ("message" in errorData) {
        throw {
          error: {
            type: "validationError",
            body: errorData.message,
          },
        };
      }

      if ("solution" in errorData) {
        throw {
          error: {
            type: "niceError",
            body: errorData,
          },
        };
      }
    }

    if (err.code === "ECONNABORTED" || err.message === "Network Error") {
      throw {
        error: {
          type: "network",
          body: "Request failed. Please check your connection.",
        },
      };
    }

    throw err;
  }
};

export default Api;

export enum API_METHODS {
  POST = "post",
  GET = "get",
  PUT = "put",
  DELETE = "delete",
}
