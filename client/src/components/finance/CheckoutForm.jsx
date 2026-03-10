import { Alert, Button, Tag, Divider, Card } from "antd";
import { LuArrowLeft, LuLock } from "react-icons/lu";

import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useState }  from "react";

function CheckoutForm({ amount, onSuccess, onBack }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: "if_required",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (paymentIntent?.status === "succeeded") {
      onSuccess(paymentIntent);
    }
  };

  return (
    <div className="w-full max-w-md nt-10">
      {/* Back Button */}
      <Button
        type="text"
        icon={<LuArrowLeft />}
        onClick={onBack}
        className="!text-slate-400 hover:!text-slate-700 !p-0 !mb-4"
      >
        Back
      </Button>

      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <LuLock className="text-white text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 m-0">Checkout</h2>
        <p className="text-slate-400 mt-1 text-sm">
          You're paying{" "}
          <span className="text-slate-900 font-bold text-base">
            ${amount.toFixed(2)}
          </span>
        </p>
      </div>

      {/* Order Summary */}
      <div className="bg-slate-50 rounded-xl p-4 mb-5">
        <div className="flex justify-between items-center">
          <span className="text-slate-500 text-sm">Amount</span>
          <Tag color="default" className="!text-slate-900 !font-bold !text-base !px-3 !py-0.5">
            ${amount.toFixed(2)}
          </Tag>
        </div>
      </div>

      <Divider className="!my-4" />

      {/* Stripe Payment Element */}
      <div className="mb-5">
        <PaymentElement />
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          closable
          className="mb-4 rounded-lg"
          onClose={() => setError("")}
        />
      )}

      <Button
        type="primary"
        size="large"
        block
        loading={loading}
        disabled={!stripe}
        onClick={handlePay}
        icon={<LuLock />}
        className="!h-12 !rounded-xl !bg-slate-900 hover:!bg-slate-700 !border-none !font-semibold !text-base"
      >
        {loading ? "Processing..." : `Pay $${amount.toFixed(2)}`}
      </Button>

      <p className="text-center text-xs text-slate-400 mt-3">
        🔒 Payments secured & encrypted by Stripe
      </p>
    </div>
  );
}

export default CheckoutForm;