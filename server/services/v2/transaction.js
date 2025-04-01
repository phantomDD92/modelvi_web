const TransactionModel = require("../../models/transaction");

const loadTransactions = (agency) =>
  TransactionModel.find({ agency: agency._id }).sort("-createdAt");

const createTransaction = (agencyId, amount, from, to, desc, accountId = undefined) =>
  TransactionModel.create({
    agency: agencyId,
    account: accountId,
    amount,
    from,
    to,
    description: desc
  })


const TransactionService2 = {
  loadTransactions,
  createTransaction,
}

module.exports = TransactionService2;