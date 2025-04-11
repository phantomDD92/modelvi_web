const mongoose = require("mongoose");
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

const getTotalEarningsByReferees = (refereeIds) =>
  TransactionModel.aggregate([
    // Match transactions from the specified referees with positive amounts
    {
      $match: {
        agency: { $in: refereeIds.map(id => new mongoose.Types.ObjectId(id)) },
        amount: { $gte: 0 }
      }
    },
    {
      $lookup: {
        from: "agencies",
        localField: "agency",
        foreignField: "_id",
        as: "agencyDetails"
      }
    },
    // Unwind the agency details array
    { $unwind: "$agencyDetails" },
    // Calculate earnings for each transaction (amount * commission%)
    {
      $addFields: {
        earnings: {
          $multiply: [
            "$amount",
            { $divide: ["$agencyDetails.commission", 100] }
          ]
        }
      }
    },
    // Group all transactions to get totals
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: "$earnings" },
        totalTransactions: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
        // Optional: breakdown by agency
        byAgency: {
          $push: {
            agencyId: "$agency",
            agencyName: "$agencyDetails.name",
            earnings: "$earnings",
            amount: "$amount",
            transactionId: "$_id",
            date: "$createdAt"
          }
        }
      }
    },
    // Project the final output
    {
      $project: {
        _id: 0,
        totalEarnings: { $round: ["$totalEarnings", 2] },
        totalTransactions: 1,
        totalAmount: { $round: ["$totalAmount", 2] },
        byAgency: 1
      }
    }
  ]);

const getMonthlyEarningsByReferees = (refereeIds, year) =>
  TransactionModel.aggregate([
    // Match transactions within date range from specified referees
    {
      $match: {
        agency: { $in: refereeIds.map(id => new mongoose.Types.ObjectId(id)) },
        amount: { $gt: 0 },
        createdAt: { $gte: new Date(`${year}-01-01`), $lt: new Date(`${year + 1}-01-01`) }
      }
    },
    // Lookup agency details
    {
      $lookup: {
        from: "agencies",
        localField: "agency",
        foreignField: "_id",
        as: "agencyDetails"
      }
    },
    { $unwind: "$agencyDetails" },
    // Calculate earnings
    {
      $addFields: {
        earnings: {
          $multiply: [
            "$amount",
            { $divide: ["$agencyDetails.commission", 100] }
          ]
        },
        month: { $month: "$createdAt" }
      }
    },
    // Group by month
    {
      $group: {
        _id: "$month",
        totalEarnings: { $sum: "$earnings" },
        transactionCount: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
        // Optional: include sample transactions
        sampleTransactions: {
          $push: {
            amount: "$amount",
            earnings: "$earnings",
            date: "$createdAt",
            agencyName: "$agencyDetails.name"
          }
        }
      }
    },
    // Format output
    {
      $project: {
        _id: 0,
        month: "$_id",
        totalEarnings: { $round: ["$totalEarnings", 2] },
        transactionCount: 1,
        totalAmount: { $round: ["$totalAmount", 2] },
        avgEarningsPerTx: { $round: [{ $divide: ["$totalEarnings", "$transactionCount"] }, 2] },
      }
    },
    { $sort: { month: 1 } }
  ]);

const TransactionService2 = {
  loadTransactions,
  createTransaction,
  getTotalEarningsByReferees,
  getMonthlyEarningsByReferees,
}

module.exports = TransactionService2;