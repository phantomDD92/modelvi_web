const TransactionService = require("../../services/v2/transaction")
const { sendError, sendResult } = require("../../utils/resp")

const handleLoadTransactions = async (req, res) => {
  try {
    const transactions = await TransactionService.loadTransactions(req.manager);
    sendResult(res, { transactions });
  } catch (error) {
    sendError(res, error)
  }
}

const TransactionCtrl = {
  handleLoadTransactions,
}

module.exports = TransactionCtrl