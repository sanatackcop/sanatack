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
  interests: string[];
  userType: string;
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
  interests,
  userType,
}: BasicSignup) => {
  try {
    const response = await trackPromise(
      Api({
        method: "post",
        url: "auth/signup",
        data: {
          personalInfo: {
            email: email.toLowerCase(),
            password,
            firstName: first_name.toLowerCase(),
            lastName: last_name.toLowerCase(),
            phone,
          },
          interests,
          userType,
        },
      })
    );
    return response.data;
  } catch (e: any) {
    console.log("login error", { e });
    throw e;
  }
};

export const verifyOtpApi = async (otp: string, email: string) => {
  try {
    const response = await trackPromise(
      Api({
        method: "post",
        url: "auth/verify-otp",
        data: {
          email: email,
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

export const sendEmailOtpApi = async (email: string) => {
  try {
    const response = await trackPromise(
      Api({
        method: "post",
        url: "auth/send-email-otp",
        data: {
          email,
        },
      })
    );
    return response.data;
  } catch (e: any) {
    console.log("login error", { e });
    throw e;
  }
};
