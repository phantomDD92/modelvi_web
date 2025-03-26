const TransactionModel = require("../../models/transaction");

const loadTransactions = (agency) =>
  TransactionModel.find({ agency: agency._id }).sort("-createdAt");

const TransactionService = {
  loadTransactions,
}

module.exports = TransactionService;