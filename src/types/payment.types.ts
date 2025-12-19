export enum PaymentType {
  INITIATED = "initiated",
  PAID = "paid",
  AUTHORIZED = "authorized",
  FAILED = "failed",
  REFUNDED = "refunded",
  CAPTURED = "captured",
  VOIDED = "voided",
  VERIFIED = "verified",
}

export type PaymentRes = {
  payment_id: string;
  amount: number;
  currency: string;
  amount_formatted: string;
  description: string;
  created_at: string;
  updated_at: string;
  status: PaymentType;
};

export type PaymentResError = {
  type: string;
  message: string;
};
