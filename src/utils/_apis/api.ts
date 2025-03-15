/* eslint-disable no-unused-vars */
import axios, { AxiosRequestConfig } from "axios";

let baseURL = import.meta.env.VITE_REACT_APP_BASEURL;

const baseApi = axios.create({
  baseURL,
  // withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const refreshApi = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const Api = async (config: AxiosRequestConfig) => {
  try {
    const response = await baseApi(config);
    return response;
  } catch (e: any) {
    const errors = e?.response?.data;

    if ("message" in errors)
      throw {
        error: { type: "validationError", body: errors?.message },
      } as any;

    if ("solution" in errors)
      throw { error: { type: "niceError", body: errors } } as any;

    throw e;
  }
};

export default Api;
