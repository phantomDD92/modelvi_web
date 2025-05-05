const crypto = require('crypto');
const { PaymentStatus, TransactionType } = require("../../config/const");
const AgencyService2 = require("../../services/v2/agency");
const CounterService = require("../../services/v2/counter");
const PaymentService2 = require("../../services/v2/payment");
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
    const payment = await PaymentService2.createPayment(id, req.manager, data);
    sendResult(res, { payment });
  } catch (error) {
    console.error(error);
    sendError(res, error);
  }
}

const handleLoadPayments = async (req, res) => {
  try {
    const payments = await PaymentService2.loadPayments(req.manager);
    sendResult(res, { payments });
  } catch (error) {
    sendError(res, error);
  }
}

const handleCancelPayment = async (req, res) => {
  try {
    const { id: paymentId } = req.params;
    await PaymentService2.cancelPayment(paymentId);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
}

const handleGetPayment = async (req, res) => {
  try {
    const { id: paymentId } = req.params;
    const payment = await PaymentService2.getPaymentById(paymentId);
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
    NotifyUtils.sendMessage("NOWPayment", "payment callback", JSON.stringify(sortObject(data)));
    const hmac = crypto.createHmac('sha512', process.env.NOWPAYMENT_IPN_KEY);
    hmac.update(JSON.stringify(sortObject(data)));
    const signature = hmac.digest('hex');
    if (sig != signature) {
      NotifyUtils.sendMessage("NOWPayment", "payment callback", "Signature checking failed");
      throw new BotError("Signature checking failed");
    }
    const payment = await PaymentService2.getPayment(data["payment_id"]);
    if (!payment) {
      NotifyUtils.sendMessage("NOWPayment", "payment callback", "Invalid payment id");
      throw new BotError("Invalid payment id");
    }
    await PaymentService2.updatePayment(payment._id, data);
    if (data["payment_status"] == PaymentStatus.FINISHED) {
      NotifyUtils.sendMessage("NOWPayment", "payment callback", "Finish payment");
      const amount = await PaymentUtils.getEstimatedPrice(data["outcome_amount"], data["outcome_amount"])
      await PaymentService2.setChargeAmount(payment._id, amount);
      const agency = await AgencyService2.updateBalance(payment.agency, amount);
      const from = agency.balance || 0;
      const to = from + data["outcome_amount"];
      await TransactionService2.createChargeTransaction(payment.agency, TransactionType.CHARGE_NOWPAYMENT, amount, from, to, payment.description);
      NotifyUtils.sendPaymentMessage(agency, "Payment By NOWPayment",
        `Currency: ${data["pay_currency"]}\nAmount: ${data["actually_paid"]}\nCharge: $${amount}\nBalance:$${from} => $${to}`
      )
    }
    sendResult(res);
  } catch (error) {
    NotifyUtils.sendMessage("NOWPayment", "payment callback error", error.message);
    sendError(res, error);
  }
}

const handleLoadPaymentsForAdmin = async (req, res) => {
  try {
    const { page, agency, status } = req.query;
    const [payments, paymentsCount] = await PaymentService2.loadPaymentsWithPage({ agency, status }, page);
    sendResult(res, { payments, paymentsCount });
  } catch (error) {
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


const PaymentCtrl2 = {
  handleCreatePayment,
  handleGetPayment,
  handleLoadPayments,
  handleCancelPayment,
  handleProcessPayment,
  handleLoadPaymentsForAdmin,
};

module.exports = PaymentCtrl2