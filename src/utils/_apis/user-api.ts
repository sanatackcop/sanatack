import { trackPromise } from "react-promise-tracker";
import Api from "./api";
import { UpdateProfileDto, UserProfileDto } from "@/types/user";

export const updateProfileApi = async (data: UpdateProfileDto) => {
  try {
    const response = await trackPromise(
      Api({
        method: "patch",
        url: "/users/profile",
        data,
        withCredentials: false,
      })
    );
    return response.data;
  } catch (e: any) {
    console.error("updateProfileApi error:", e);
    throw e;
  }
};

export const getProfileApi = async (): Promise<UserProfileDto> => {
  try {
    const response = await trackPromise(
      Api({
        method: "get",
        url: "/users/profile",
        withCredentials: false,
      }) as Promise<{ data: UserProfileDto }>
    );
    return response.data;
  } catch (e: any) {
    console.error("getProfileApi error:", e);
    throw e;
  }
};
