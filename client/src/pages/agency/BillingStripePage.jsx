import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Card, Steps, Result, Input, Alert, Button, Tag, Row, Col } from "antd";
import {
  CheckCircleOutlined,
  DollarOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { CheckoutForm, PricePlansView } from "@/components/finance";
import { createStripePayment, getProfile } from "@/redux/v2/actions";
import { STRIPE_PUBLIC_KEY } from "@/utils/const";
import { useDispatch } from "react-redux";

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const QUICK_AMOUNTS = [100, 200, 500, 1000];

// ── Step 1: Amount Input ──────────────────────────────────────────
function AmountStep({ onNext }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleNext = async () => {
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) return setError("Please enter a valid amount.");
    if (parsed < 0.5) return setError("Minimum amount is $0.50.");

    setError("");
    setLoading(true);
    dispatch(createStripePayment({ amount: parsed, currency: "usd" }, (secret) => {
      setLoading(false);
      if (secret) {
        onNext({ amount: parsed, clientSecret: secret });
      }
    }))
  };

  return (
    <div className="w-full max-w-md mt-10">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <DollarOutlined className="text-white text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 m-0">Enter Amount</h2>
        <p className="text-slate-400 mt-1 text-sm">How much would you like to pay?</p>
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <Input
          size="large"
          type="number"
          min={50}
          step={50}
          placeholder="0.00"
          value={amount}
          onChange={(e) => { setAmount(e.target.value); setError(""); }}
          onPressEnter={handleNext}
          prefix={<span className="text-slate-900 font-bold text-lg">$</span>}
          className="!rounded-xl !text-2xl !font-bold !h-14 !border-slate-200"
          autoFocus
        />
      </div>

      {/* Quick Amount Buttons */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {QUICK_AMOUNTS.map((val) => (
          <button
            key={val}
            onClick={() => { setAmount(String(val)); setError(""); }}
            className={`py-2 rounded-lg text-sm font-semibold border transition-all cursor-pointer
              ${amount === String(val)
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-400"
              }`}
          >
            ${val}
          </button>
        ))}
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
        disabled={!amount}
        onClick={handleNext}
        icon={<ThunderboltOutlined />}
        className="!h-12 !rounded-xl !bg-slate-900 hover:!bg-slate-700 !border-none !font-semibold !text-base"
      >
        {loading ? "Preparing..." : "Continue to Payment"}
      </Button>
    </div>
  );
}

function CheckoutStep({ amount, clientSecret, onSuccess, onBack }) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "flat",
          variables: {
            colorPrimary: "#0f172a",
            colorBackground: "#ffffff",
            colorText: "#0f172a",
            colorDanger: "#ef4444",
            borderRadius: "10px",
            fontFamily: "inherit",
          },
        },
      }}
    >
      <CheckoutForm amount={amount} onSuccess={onSuccess} onBack={onBack} />
    </Elements>
  );
}

// ── Step 3: Success ───────────────────────────────────────────────
function SuccessStep({ amount, paymentIntent, onReset }) {
  return (
    <div className="w-full max-w-md  text-center mt-10">
      <Result
        icon={<CheckCircleOutlined className="!text-emerald-500 !text-6xl" />}
        title={
          <span className="text-2xl font-bold text-slate-900">
            Payment Successful!
          </span>
        }
        subTitle={
          <span className="text-slate-400">
            Your payment of{" "}
            <strong className="text-slate-900">${amount.toFixed(2)}</strong>{" "}
            was completed.
          </span>
        }
      />

      {/* Receipt */}
      <div className="bg-slate-50 rounded-xl p-4 mx-4 mb-6 text-left space-y-3">
        {[
          { label: "Amount Paid", value: `$${amount.toFixed(2)}` },
          {
            label: "Status",
            value: <Tag color="success">Succeeded</Tag>,
          },
          {
            label: "Transaction ID",
            value: (
              <code className="bg-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded">
                {paymentIntent?.id?.slice(-16)}
              </code>
            ),
          },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center border-b border-slate-200 pb-3 last:border-0 last:pb-0">
            <span className="text-slate-500 text-sm">{label}</span>
            <span className="font-semibold text-sm">{value}</span>
          </div>
        ))}
      </div>

      <Button
        type="primary"
        size="large"
        block
        onClick={onReset}
        className="!h-12 !rounded-xl !bg-emerald-600 hover:!bg-emerald-700 !border-none !font-semibold mx-4 !w-auto"
      >
        Make Another Payment
      </Button>
    </div>
  );
}

export default function PaymentPage() {

  const [step, setStep] = useState(0);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const dispatch = useDispatch();

  const reloadProfile = () => {
    dispatch(getProfile());
  }

  return (
    <Card>
      <Row>
        <Col span={12}>
          <PricePlansView />
        </Col>
        <Col span={12} >
          {/* Steps Indicator */}
          <Steps
            current={step}
            size="small"
            className="max-w-md w-full"
            items={[
              { title: "Amount" },
              { title: "Checkout" },
              { title: "Done" },
            ]}
          />

          {/* Step Panels */}
          {step === 0 && (
            <AmountStep
              onNext={(data) => { setPaymentData(data); setStep(1); }}
            />
          )}
          {step === 1 && paymentData && (
            <CheckoutStep
              amount={paymentData.amount}
              clientSecret={paymentData.clientSecret}
              onSuccess={(intent) => { setPaymentIntent(intent); setStep(2); reloadProfile(); }}
              onBack={() => setStep(0)}
            />
          )}
          {step === 2 && (
            <SuccessStep
              amount={paymentData.amount}
              paymentIntent={paymentIntent}
              onReset={() => { setStep(0); setPaymentData(null); setPaymentIntent(null); }}
            />
          )}
        </Col>
      </Row>
    </Card>
  );
}