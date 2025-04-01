const { PaymentStatus } = require("../../config/const");
const AgencyService2 = require("../../services/v2/agency");
const CounterService = require("../../services/v2/counter");
const PaymentService = require("../../services/v2/payment");
const TransactionService2 = require("../../services/v2/transaction");
const PaymentUtils = require("../../utils/payment");
const { sendError, sendResult } = require("../../utils/resp");

const handleCreatePayment = async (req, res) => {
  try {
    const { currency } = req.body;
    // first create payment order
    const id = await CounterService.getNextSequence("payment");
    const data = await PaymentUtils.createPayment(req.manager, id, currency);
    const payment = await PaymentService.createPayment(id, req.manager, data);
    sendResult(res, { payment });
  } catch (error) {
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
    const hmac = crypto.createHmac('sha512', process.env.NOWPAYMENT_IPN_KEY);
    hmac.update(JSON.stringify(sortObject(data)));
    const signature = hmac.digest('hex');
    if (sig != signature)
      throw new BotError("Signature checking failed");
    const payment = await PaymentService.getPayment(data["payment_id"]);
    if (!payment)
      throw new BotError("Invalid payment id");
    await PaymentService.updatePayment(payment._id, data);
    if (data["payment_status"] == PaymentStatus.FINISHED) {
      const agency = await AgencyService2.updateBalance(payment.agency, data["actually_paid"]);
      const from = agency.balance || 0;
      const to = from + data["actually_paid"];
      await TransactionService2.createTransaction(payment.agency, data["actually_paid"], from, to, payment.description);
    }
    sendResult(res);
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



const PaymentCtrl = {
  handleCreatePayment,
  handleGetPayment,
  handleLoadPayments,
  handleCancelPayment,
  handleProcessPayment
};

module.exports = PaymentCtrl