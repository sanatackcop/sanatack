/* eslint-disable no-unused-vars */
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

let baseURL = import.meta.env.VITE_REACT_APP_BASEURL;

const baseApi = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    Connection: "keep-alive",
  },
  timeout: 30000,
});

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
