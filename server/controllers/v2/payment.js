const crypto = require('crypto');
const { PaymentStatus } = require("../../config/const");
const AgencyService2 = require("../../services/v2/agency");
const CounterService = require("../../services/v2/counter");
const PaymentService = require("../../services/v2/payment");
const TransactionService2 = require("../../services/v2/transaction");
const NotifyUtils = require("../../utils/notifiy");
const PaymentUtils = require("../../utils/payment");
const { sendError, sendResult } = require("../../utils/resp");

const handleCreatePayment = async (req, res) => {
  try {
    const { currency } = req.body;
    // first create payment order
    const id = await CounterService.getNextSequence("payment");
    const { min_amount: minAmount, fiat_equivalent: minFiat } = await PaymentUtils.getMinimumPaymentAmount(currency);
    const data = await PaymentUtils.createPayment(req.manager, id, currency, minAmount, minFiat);
    const payment = await PaymentService.createPayment(id, req.manager, data);
    sendResult(res, { payment });
  } catch (error) {
    console.error(error);
    sendError(res, error);
  }
}

const handleLoadPayments = async (req, res) => {
  try {
    const payments = await PaymentService.loadPayments(req.manager);
    sendResult(res, { payments });
  } catch (error) {
    sendError(res, error);
  }
}

const handleCancelPayment = async (req, res) => {
  try {
    const { id: paymentId } = req.params;
    await PaymentService.cancelPayment(paymentId);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
}

const handleGetPayment = async (req, res) => {
  try {
    const { id: paymentId } = req.params;
    const payment = await PaymentService.getPaymentById(paymentId);
    sendResult(res, { payment });
  } catch (error) {
    sendError(res, error);
  }
}

function sortObject(obj) {
  return Object.keys(obj).sort().reduce(
    (result, key) => {
      result[key] = (obj[key] && typeof obj[key] === 'object') ? sortObject(obj[key]) : obj[key]
      return result
    },
    {}
  )
}


const handleProcessPayment = async (req, res) => {
  try {
    const data = req.body;
    const sig = req.header("x-nowpayments-sig");
    await NotifyUtils.sendMessage("NOWPayment", "payment callback", JSON.stringify(sortObject(data)));
    const hmac = crypto.createHmac('sha512', process.env.NOWPAYMENT_IPN_KEY);
    hmac.update(JSON.stringify(sortObject(data)));
    const signature = hmac.digest('hex');
    if (sig != signature) {
      await NotifyUtils.sendMessage("NOWPayment", "payment callback", "Signature checking failed");
      throw new BotError("Signature checking failed");
    }
    const payment = await PaymentService.getPayment(data["payment_id"]);
    if (!payment) {
      await NotifyUtils.sendMessage("NOWPayment", "payment callback", "Invalid payment id");
      throw new BotError("Invalid payment id");
    }
    await PaymentService.updatePayment(payment._id, data);
    if (data["payment_status"] == PaymentStatus.FINISHED) {
      await NotifyUtils.sendMessage("NOWPayment", "payment callback", "Finish payment");
      const agency = await AgencyService2.updateBalance(payment.agency, data["outcome_amount"]);
      const from = agency.balance || 0;
      const to = from + data["outcome_amount"];
      await TransactionService2.createTransaction(payment.agency, data["outcome_amount"], from, to, payment.description);
      NotifyUtils.sendPaymentMessage(agency, "Payment By NOWPayment",
        `Currency: ${data["pay_currency"]}\nAmount: ${data["actually_paid"]}\nCharge: $${data["outcome_amount"]}\nBalance:$${from} => $${to}`
      )
    }
    sendResult(res);
  } catch (error) {
    await NotifyUtils.sendMessage("NOWPayment", "payment callback error", error.message);
    sendError(res, error);
  }
}

const handleProcess = async (req, res) => {
  try {
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
}



const PaymentCtrl = {
  handleCreatePayment,
  handleGetPayment,
  handleLoadPayments,
  handleCancelPayment,
  handleProcessPayment
};

module.exports = PaymentCtrl