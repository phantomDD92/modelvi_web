const axios = require('axios');
const { ApiError } = require('./resp');

const getApiStatus = async () => {
  try {
    await axios.get("https://api-sandbox.nowpayments.io/v1/status");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

const getAvailableCurrencies = async () => {
  try {
    const resp = await axios.get("https://api-sandbox.nowpayments.io/v1/currencies", { headers: { 'x-api-key': process.env.NOWPAYMENT_API_KEY } });
    return resp.data?.currencies;
  } catch (error) {
    throw new ApiError("NowPayment service not available");
  }
}

const createPayment = async (agency, orderId, currency, minAmount, minFiat) => {
  try {
    const resp = await axios.post(
      "https://api.nowpayments.io/v1/payment",
      {
        "price_amount": minFiat,
        "price_currency": "usd",
        "pay_amount": minAmount,
        "pay_currency": currency,
        "ipn_callback_url": "https://modelvi.com/api/v2/agency/payment_callback",
        "order_id": `${orderId}`,
        "order_description": `Modelvi payment from ${agency.name}`,
        "is_fee_paid_by_user": false,
      },
      { headers: { 'x-api-key': process.env.NOWPAYMENT_API_KEY } });
    return resp.data;
  } catch (error) {
    console.error(error);
    throw ApiError("NowPayment service failed");
  }
}

const getMinimumPaymentAmount = async (currency) => {
  try {
    const resp = await axios.get(
      "https://api.nowpayments.io/v1/min-amount",
      {
        headers: { 'x-api-key': process.env.NOWPAYMENT_API_KEY },
        params: {
          "currency_from": currency,
          "fiat_equivalent": 'usd',
          "is_fixed_rate": false,
          "is_fee_paid_by_user": false,
        }
      });
    return resp.data;
  } catch (error) {
    console.error(error);
    throw ApiError("NowPayment service failed");
  }
}

const PaymentUtils = {
  getApiStatus,
  getAvailableCurrencies,
  getMinimumPaymentAmount,
  createPayment,
};

module.exports = PaymentUtils;