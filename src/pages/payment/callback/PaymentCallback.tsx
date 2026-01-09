import { verifyPayment } from "@/utils/_apis/payment.api";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  PaymentRes,
  PaymentResError,
  PaymentType,
} from "@/types/payment.types";
import { refreshTokens } from "@/utils/_apis/api";
import { useUserContext } from "@/context/UserContext";

// if successful
// JWT update
// plan: pro

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useUserContext();
  const payment_id = searchParams.get("id");

  const [verifying, setVerifying] = useState(true);
  const [status, setStatus] = useState<"success" | "failed" | "error" | null>(
    null
  );
  const [message, setMessage] = useState<string>("");
  const [paymentData, setPaymentData] = useState<PaymentRes | null>(null);

  async function handlePaymentVerification() {
    if (!payment_id) {
      setStatus("error");
      setMessage("Payment ID is missing in the URL.");
      setVerifying(false);
      return;
    }

    try {
      setVerifying(true);

      const { data }: { data: PaymentRes | PaymentResError } =
        await verifyPayment({ payment_id });

      if ("type" in data) {
        setStatus("error");
        setMessage(data.message || "Unknown payment verification error");
        return;
      }

      if (data.status === PaymentType.PAID) {
        setStatus("success");
        setMessage("Your payment was successful! 🎉");
        setPaymentData(data);
      } else {
        setStatus("failed");
        setMessage(`Payment status: ${data.status}`);
      }
      const loginRes = await refreshTokens();
      login(loginRes);
      setTimeout(() => {
        navigate("/dashboard/overview");
      }, 5000);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("An error occurred while verifying your payment.");
    } finally {
      setVerifying(false);
    }
  }

  useEffect(() => {
    handlePaymentVerification();
  }, []);

  const StatusIcon = () => {
    if (verifying) return null;

    return (
      <div className="mb-4">
        {status === "success" && (
          <div className="text-green-600 text-6xl">✓</div>
        )}
        {status === "failed" && <div className="text-red-600 text-6xl">✕</div>}
        {status === "error" && (
          <div className="text-yellow-500 text-6xl">⚠️</div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center border border-gray-200">
        {verifying && (
          <>
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-300 border-t-transparent mx-auto mb-6"></div>
            <p className="text-lg font-medium text-gray-700">
              Verifying your payment...
            </p>
          </>
        )}

        {!verifying && <StatusIcon />}

        {!verifying && status === "success" && (
          <>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Payment Successful
            </h2>
            <p className="text-gray-700 mb-4">{message}</p>

            {paymentData && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 text-left mb-6">
                <p>
                  <strong>Amount:</strong> {paymentData.amount_formatted}
                </p>
                <p>
                  <strong>Description:</strong> {paymentData.description}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(paymentData.created_at).toLocaleString()}
                </p>
                <p>
                  <strong>Payment ID:</strong> {paymentData.payment_id}
                </p>
              </div>
            )}

            <button
              onClick={() => navigate("/dashboard/overview")}
              className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 w-full"
            >
              Go to Dashboard
            </button>
          </>
        )}

        {!verifying && status === "failed" && (
          <>
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-700 mb-6">{message}</p>
            <button
              onClick={() => navigate("/dashboard/overview")}
              className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 w-full"
            >
              Back to Dashboard
            </button>
          </>
        )}

        {!verifying && status === "error" && (
          <>
            <h2 className="text-2xl font-bold text-yellow-600 mb-2">Error</h2>
            <p className="text-gray-700 mb-6">{message}</p>
            <button
              onClick={() => navigate("/dashboard/overview")}
              className="px-5 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 w-full"
            >
              Return to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;
