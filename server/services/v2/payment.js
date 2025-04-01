const { PaymentStatus } = require("../../config/const");
const PaymentModel = require("../../models/payment");

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

const updatePayment = (id, data) =>
  PaymentModel.findByIdAndUpdate(id, {
    status: data["payment_status"],
    payAddress: data["pay_address"],
    payAmount: data["pay_amount"],
    payCurrency: data["pay_currency"],
    priceAmount: data["price_amount"],
    priceCurrency: data["price_currency"],
    actuallyPaid: data["actually_paid"],
  })

const loadPayments = (agency) =>
  PaymentModel.find({ agency: agency._id, status: { $ne: PaymentStatus.CANCEL } })
    .sort("-createdAt")

const getPayment = (paymentId) =>
  PaymentModel.findOne({ paymentId });

const PaymentService = {
  createPayment,
  getPaymentById,
  updatePayment,
  cancelPayment,
  loadPayments,
  getPayment,
};

module.exports = PaymentService;
