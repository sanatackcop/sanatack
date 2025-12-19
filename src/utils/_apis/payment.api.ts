import { trackPromise } from "react-promise-tracker";
import { PaymentRes, PaymentResError } from "@/types/payment.types";
import Api from "./api";

export const verifyPayment = async ({
  payment_id,
}: {
  payment_id: string;
}): Promise<any> => {
  try {
    const response = await trackPromise(
      Api({
        method: "post",
        url: `payments/verify/${payment_id}`,
        withCredentials: false,
      }) as unknown as Promise<PaymentRes | PaymentResError>
    );
    if (response) return response;
    return {
      type: "unknown_error",
      message: "No response from server",
    };
  } catch (e: any) {
    console.error("getAllCoursesApi error:", e);
    throw e;
  }
};

export const newPaymentEvent = async (payment: any): Promise<any> => {
  try {
    const response = await trackPromise(
      Api({
        method: "post",
        url: `payments/pending`,
        data: { payment },
        withCredentials: false,
      }) as unknown as Promise<PaymentRes | PaymentResError>
    );
    if (response) return response;
    return {
      type: "unknown_error",
      message: "No response from server",
    };
  } catch (e: any) {
    console.error("getAllCoursesApi error:", e);
    throw e;
  }
};
