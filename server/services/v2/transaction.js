const mongoose = require("mongoose");
const moment = require("moment");
const TransactionModel = require("../../models/transaction");
const { TransactionType } = require("../../config/const");

const loadTransactions = (agency) =>
  TransactionModel.find({ agency: agency._id }).sort("-createdAt");

const createTransaction = (agencyId, type, amount, from, to, desc, accountId = undefined) =>
  TransactionModel.create({
    agency: agencyId,
    type,
    account: accountId,
    amount,
    from,
    to,
    description: desc
  })

const createChargeTransaction = (agencyId, amount, from, to, desc) =>
  TransactionModel.create({
    agency: agencyId,
    type: TransactionType.CHARGE,
    amount,
    from,
    to,
    description: desc
  });

const createExpenseTransaction = (agencyId, accountId, amount, from, to, desc, commission) =>
  TransactionModel.create({
    agency: agencyId,
    account: accountId,
    type: TransactionType.EXPENSE,
    amount: -1 * amount,
    from,
    to,
    description: desc,
    commission,
  });

const getTotalEarningsByReferees = (refereeIds) =>
  TransactionModel.aggregate([
    {
      $match: {
        agency: { $in: refereeIds.map(id => new mongoose.Types.ObjectId(id)) },
        type: TransactionType.EXPENSE,
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
    // Group all transactions to get totals
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: "$commission" },
        totalTransactions: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
        // Optional: breakdown by agency
        byAgency: {
          $push: {
            agencyId: "$agency",
            agencyName: "$agencyDetails.name",
            commission: "$commission",
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
        type: TransactionType.EXPENSE,
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
    // Group by month
    {
      $group: {
        _id: "$month",
        totalEarnings: { $sum: "$commission" },
        transactionCount: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
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
      }
    },
    { $sort: { month: 1 } }
  ]);

const getTotalStatsByAgency = async () => {
  return await TransactionModel.aggregate([
    { $match: { type: TransactionType.EXPENSE, } },
    {
      $lookup: {
        from: "managers",
        localField: "agency",
        foreignField: "_id",
        as: "agencyData"
      }
    },
    { $unwind: "$agencyData" },
    { $match: { "agencyData.referrer": { $exists: true, $ne: null } } },
    {
      $lookup: {
        from: "managers",
        localField: "agencyData.referrer",
        foreignField: "_id",
        as: "referrerData"
      }
    },
    { $unwind: "$referrerData" },
    // Group by agency and referrer
    {
      $group: {
        _id: "$agencyData.referrer",
        totalAmount: { $sum: "$amount" },
        totalCommission: { $sum: "$commission" },
        transactionCount: { $sum: 1 },
      }
    },
    {
      $project: {
        totalAmount: 1,
        totalCommission: 1,
        transactionCount: 1,
      }
    },
    { $sort: { totalCommission: -1 } }
  ]);
};

const getTotalStatsByTime = async (timePeriod = 'day') => {
  let dateFormat, dateFilter;
  switch (timePeriod) {
    case 'day':
      dateFormat = { day: { $dayOfMonth: "$createdAt" }, month: { $month: "$createdAt" }, year: { $year: "$createdAt" } };
      break;
    case 'month':
      dateFormat = { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } };
      break;
    case 'week':
      dateFormat = { week: { $week: "$createdAt" }, year: { $year: "$createdAt" } }
      break;
    default:
      dateFormat = { day: { $dayOfMonth: "$createdAt" }, month: { $month: "$createdAt" }, year: { $year: "$createdAt" } };
  }
  switch (timePeriod) {
    case 'day':
      dateFilter = { createdAt: { $gte: moment().startOf("day").subtract(15, "day").toDate(), $lte: moment().endOf("day").toDate() } }
      break;
    case 'month':
      dateFilter = { createdAt: { $gte: moment().startOf("month").subtract(12, "month").toDate(), $lte: moment().endOf("month").toDate() } }
      break;
    case 'week':
      dateFilter = { createdAt: { $gte: moment().startOf("week").subtract(10, "week").toDate(), $lte: moment().endOf("week").toDate() } }
      break;
    default:
      dateFilter = { createdAt: { $gte: moment().startOf("day").subtract(15, "day").toDate(), $lte: moment().endOf("day").toDate() } }
  }
  return await TransactionModel.aggregate([
    { $match: { ...dateFilter, type: TransactionType.EXPENSE, } },
    {
      $lookup: {
        from: "managers",
        localField: "agency",
        foreignField: "_id",
        as: "agencyData"
      }
    },
    { $unwind: "$agencyData" },
    { $match: { "agencyData.referrer": { $exists: true, $ne: null } } },
    {
      $lookup: {
        from: "managers",
        localField: "agencyData.referrer",
        foreignField: "_id",
        as: "referrerData"
      }
    },
    { $unwind: "$referrerData" },
    {
      $group: {
        _id: { ...dateFormat },
        totalAmount: { $sum: "$amount" },
        totalCommission: { $sum: "$commission" },
        transactionCount: { $sum: 1 },
      }
    },
    {
      $project: {
        date: "$_id",
        totalAmount: 1,
        totalCommission: 1,
        transactionCount: 1,
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.week": 1, "_id.day": 1 } }
  ]);
};

const TransactionService2 = {
  loadTransactions,
  createTransaction,
  createChargeTransaction,
  createExpenseTransaction,
  getTotalEarningsByReferees,
  getMonthlyEarningsByReferees,
  getTotalStatsByAgency,
  getTotalStatsByTime,
}

module.exports = TransactionService2;