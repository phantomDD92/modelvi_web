const TransactionService2 = require("../../services/v2/transaction")
const { sendError, sendResult } = require("../../utils/resp")

const handleLoadTransactions = async (req, res) => {
  try {
    const transactions = await TransactionService2.loadTransactions(req.manager);
    sendResult(res, { transactions });
  } catch (error) {
    sendError(res, error)
  }
}


const handleLoadTransactionForAdmin = async (req, res) => {
  try {
    const { page, agency, type } = req.query;
    const [transactions, transactionsCount] = await TransactionService2.loadTransactionsWithPage({ agency, type }, page);
    sendResult(res, { transactions, transactionsCount });
  } catch (error) {
    sendError(res, error);
  }
}


const TransactionCtrl2 = {
  handleLoadTransactions,
  handleLoadTransactionForAdmin
}

module.exports = TransactionCtrl2