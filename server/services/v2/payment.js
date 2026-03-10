const { PaymentStatus } = require("../../config/const");
const PaymentModel = require("../../models/payment");
const StripeModel = require("../../models/stripe");

const createPayment = (id, agency, data) =>
  PaymentModel.create({
    _id: id,
    agency: agency._id,
    payAddress: data["pay_address"],
    payAmount: data["pay_amount"],
    payCurrency: data["pay_currency"],
    paymentId: data["payment_id"],
    priceAmount: data["price_amount"],
    priceCurrency: data["price_currency"],
    network: data["network"],
    description: data["order_description"],
    status: data["payment_status"],
    expiredAt: new Date(data["expiration_estimate_date"]),
  });

const getPaymentById = (id, fields) =>
  PaymentModel.findById(id, fields);

const cancelPayment = (paymentId) =>
  PaymentModel.findByIdAndUpdate(paymentId, { $set: { status: PaymentStatus.CANCEL } });

const setChargeAmount = (paymentId, chargeAmount) =>
  PaymentModel.findByIdAndUpdate(paymentId, { $set: { chargeAmount } });

const updatePayment = (id, data, amount) =>
  PaymentModel.findByIdAndUpdate(id, {
    status: data["payment_status"],
    payAddress: data["pay_address"],
    payAmount: data["pay_amount"],
    payCurrency: data["pay_currency"],
    priceAmount: data["price_amount"],
    priceCurrency: data["price_currency"],
    paidAmount: data["actually_paid"],
    outcomeAmount: data["outcome_amount"],
    outcomeCurrency: data["outcome_currency"],
    chargeAmount: amount,
    fee: data["fee"],
  })

const loadPayments = (agency) =>
  PaymentModel.find({ agency: agency._id, status: { $ne: PaymentStatus.CANCEL } })
    .sort("-createdAt")

const getPayment = (paymentId) =>
  PaymentModel.findOne({ paymentId });

const loadPaymentsWithPage = ({ status, agency }, page) => {
  const agencyQuery = agency && agency != "" ? { agency } : {};
  const statusQuery = status && status != "" ? { status } : {};
  const query = {
    ...agencyQuery,
    ...statusQuery,
  }
  return Promise.all([
    PaymentModel.find(query)
      .sort("-createdAt")
      .skip((parseInt(page) - 1) * 20)
      .limit(20)
      .populate("agency", "name"),
    PaymentModel.countDocuments(query),
  ])
}

const createStripePayment = (id, data) =>
  StripeModel.create({
    _id: id,
    agency: data.metadata?.agency,
    paymentId: data["id"],
    amount: data["amount_received"],
    clientSecret: data["client_secret"],
    currency: data["currency"],
    status: data["status"],
    extra: data,
  });

const loadStripePayments = (agency) =>
  StripeModel.find({ agency: agency._id })
    .sort("-createdAt");

const PaymentService2 = {
  createPayment,
  getPaymentById,
  updatePayment,
  cancelPayment,
  loadPayments,
  getPayment,
  setChargeAmount,
  loadPaymentsWithPage,
  createStripePayment,
  loadStripePayments,
};

module.exports = PaymentService2;
