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

const createPayment = async (agency, orderId, currency) => {
  try {
    const resp = await axios.post(
      "https://api.nowpayments.io/v1/payment",
      {
        "price_amount": 100,
        "price_currency": "usd",
        "pay_amount": 10,
        "pay_currency": currency,
        "ipn_callback_url": "https://modelvi.com/api/v2/payment_callback",
        "order_id": `${orderId}`,
        "order_description": `Modelvi payment from ${agency.name}`
      },
      { headers: { 'x-api-key': process.env.NOWPAYMENT_API_KEY } });
    return resp.data;
  } catch (error) {
    console.error(error);
    throw ApiError("NowPayment service unavailable");
  }
}

const PaymentUtils = {
  getApiStatus,
  getAvailableCurrencies,
  createPayment,
};

module.exports = PaymentUtils;