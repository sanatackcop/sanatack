import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import Storage from "@/lib/Storage";

let baseURL = import.meta.env.VITE_REACT_APP_BASEURL;

export interface CustomError {
  error: {
    type: string;
    body: string;
  };
}

const baseApi = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  timeout: 30000,
});

const getAuth = (): any => Storage.get("auth");

baseApi.interceptors.request.use(
  async (config: any) => {
    try {
      const auth: any = await getAuth();
      if (auth.user.id) {
        config.headers = {
          ...config.headers,
          user_id: auth.user.id,
        };
        config.params = {
          ...(config.params || {}),
          user_id: auth.user.id,
        };
      }
    } catch (error) {
      console.error("Error fetching auth data:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const refreshApi = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const Api = async <T = unknown>(
  config: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  try {
    return await baseApi(config);
  } catch (err: any) {
    const errorData = err?.response?.data;

    if (errorData && typeof errorData === "object") {
      if ("message" in errorData) {
        throw { error: { type: "validationError", body: errorData.message } };
      }

      if ("solution" in errorData) {
        throw { error: { type: "niceError", body: errorData } };
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
