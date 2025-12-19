import { newPaymentEvent } from "@/utils/_apis/payment.api";
import { useEffect } from "react";

const Moyasar = (window as any).Moyasar;

export type PaymentData = {
  plan_type: "pro" | "free";
  amount: number;
  billing_interval: "monthly" | "yearly";
  currency: "SAR" | "USD";
};

export interface PaymentFormProps {
  amount: number;
  description: string;
  callback_url: string;
  language: "en" | "ar";
  currency: "SAR" | "USD" | "KWD" | "AED";
  metadata?: {
    user_id: string;
    plan_type: "pro" | "free";
    billing_interval: "monthly" | "yearly";
  };
}

export default function PaymentForm({
  amount,
  description,
  callback_url,
  language,
  currency,
  metadata,
}: PaymentFormProps) {
  const publishable_api_key = import.meta.env.VITE_MOYASAR_ACCESS_KEY;

  useEffect(() => {
    if (Moyasar) {
      Moyasar.init({
        language,
        amount: Math.round(amount * 100),
        currency,
        description,
        callback_url,
        metadata,
        element: ".mysr-form",
        methods: ["applepay", "creditcard"],
        supported_networks: ["visa", "mastercard", "mada"],
        credit_card: {
          save_card: true,
        },
        publishable_api_key,
        on_completed: async function (payment: any) {
          await newPaymentEvent(payment);
        },
        on_failure: async function (error: any) {
          console.error("Payment failed:", error);
        },
        apple_pay: {
          country: "SA",
          label: "Awesome Cookie Store",
          validate_merchant_url: "https://api.moyasar.com/v1/applepay/initiate",
        },
      });
    }
  }, []);

  return <div className="mysr-form"></div>;
}
