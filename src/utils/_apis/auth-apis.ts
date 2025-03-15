/* eslint-disable no-unused-vars */
import { trackPromise } from "react-promise-tracker";
import Api from "./api";
import { ContextType } from "@/context/UserContext";
export enum Dashboard {
  ADMIN = "admin",
  STUDENT = "student",
}

interface BasicLogin {
  email: string;
  password: string;
}

interface BasicSignup extends BasicLogin {
  phone: string;
  first_name: string;
  last_name: string;
}

enum Roles {
  STUDENT = "student",
  ADMIN = "admin",
}

export type User = {
  email: string;
  first_name: string;
  last_name: string;
  role: Roles;
  isPro: boolean;
  isVerify: boolean;
  isActive: boolean;
};

export type LoginResult = {
  user: string;
  type: ContextType;
  role: "admin" | "student";
  refresh_token: string;
};

export const loginApi = async ({ email, password }: BasicLogin) => {
  try {
    const response = await trackPromise(
      Api({
        method: "post",
        url: "auth/login",
        data: {
          email: email.toLowerCase(),
          password,
        },
      })
    );
    return response.data;
  } catch (e: any) {
    console.log("login error", { e });
    throw e;
  }
};

export const signupApi = async ({
  email,
  password,
  first_name,
  last_name,
  phone,
}: BasicSignup) => {
  try {
    const response = await trackPromise(
      Api({
        method: "post",
        url: "auth/singup",
        data: {
          email: email.toLowerCase(),
          password,
          first_name: first_name.toLowerCase(),
          last_name: last_name.toLowerCase(),
          phone,
        },
      })
    );
    return response.data;
  } catch (e: any) {
    console.log("login error", { e });
    throw e;
  }
};

export const verifyOtpApi = async ({
  otp,
  user_id,
}: {
  otp: string;
  user_id: string;
}) => {
  try {
    const response = await trackPromise(
      Api({
        method: "post",
        url: "auth/verify-otp",
        data: {
          user_id: user_id,
          otp: otp,
        },
      })
    );
    return response.data;
  } catch (e: any) {
    console.log("login error", { e });
    throw e;
  }
};

export const sendEmailOtpApi = async ({
  user_id,
  email,
}: {
  user_id: string;
  email: string;
}) => {
  try {
    const response = await trackPromise(
      Api({
        method: "post",
        url: "auth/send-email-otp",
        data: {
          user_id: user_id,
          email: email,
        },
      })
    );
    return response.data;
  } catch (e: any) {
    console.log("login error", { e });
    throw e;
  }
};
