const mongoose = require("mongoose");
const moment = require('moment');
const AffiliateModel = require("../../models/affiliate");

const findOrCreateAffiliate = (agencyId, referralCode, ipAddress) =>
  AffiliateModel.findOneAndUpdate({ referrer: agencyId, referralCode, ipAddress }, {
    $setOnInsert: { // Only set these on creation
      referrer: agencyId,
      referralCode,
      ipAddress,
      clickedAt: new Date()
    }
  }, { new: true, upsert: true, setDefaultsOnInsert: true });


const setAffiliateAttempted = (affiliateId) =>
  AffiliateModel.findByIdAndUpdate(affiliateId, { attempted: true, attemptedAt: new Date() })

const setAffiliateCompleted = (affiliateId) =>
  AffiliateModel.findByIdAndUpdate(affiliateId, { completed: true, completedAt: new Date() })

const getAgencyTotalAffiliateStats = (agencyId) =>
  AffiliateModel.aggregate([
    {
      $match: {
        referrer: new mongoose.Types.ObjectId(agencyId),
      }
    },
    {
      $project: {
        clicked: 1,
        attempted: 1,
        completed: 1
      }
    },
    {
      $group: {
        _id: null,
        totalClicks: { $sum: 1 },
        totalAttempts: { $sum: { $cond: [{ $eq: ["$attempted", true] }, 1, 0] } },
        totalCompletions: { $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] } },
      }
    },
    // Project the final output
    {
      $project: {
        _id: 0,
        totalClicks: 1,
        totalAttempts: 1,
        totalCompletions: 1,
      }
    }
  ]);

const getAgencyMonthlyAffiliateStats = (agencyId, year) =>
  AffiliateModel.aggregate([
    {
      $match: {
        referrer: new mongoose.Types.ObjectId(agencyId),
        clickedAt: {
          $gte: new Date(`${year}-01-01`),
          $lt: new Date(`${year + 1}-01-01`)
        }
      }
    },
    {
      $project: {
        month: { $month: "$clickedAt" },
        clicked: 1,
        attempted: 1,
        completed: 1
      }
    },
    {
      $group: {
        _id: "$month",
        clicks: { $sum: 1 },
        attempts: { $sum: { $cond: [{ $eq: ["$attempted", true] }, 1, 0] } },
        completions: { $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] } },
        attemptRate: {
          $avg: { $cond: [{ $eq: ["$attempted", true] }, 1, 0] }
        },
        conversionRate: {
          $avg: { $cond: [{ $eq: ["$completed", true] }, 1, 0] }
        }
      }
    },
    {
      $sort: { "_id": 1 }
    },
    {
      $project: {
        month: "$_id",
        clicks: 1,
        attempts: 1,
        completions: 1,
        attemptRate: { $round: [{ $multiply: ["$attemptRate", 100] }, 2] },
        conversionRate: { $round: [{ $multiply: ["$conversionRate", 100] }, 2] },
        _id: 0
      }
    }
  ])

const getTotalAffiliateStatsByAgency = () =>
  AffiliateModel.aggregate([
    {
      $group: {
        _id: "$referrer",
        totalClicks: { $sum: 1 }, // Every record is a click
        totalAttempts: {
          $sum: {
            $cond: [{ $eq: ["$attempted", true] }, 1, 0]
          }
        },
        totalCompletions: {
          $sum: {
            $cond: [{ $eq: ["$completed", true] }, 1, 0]
          }
        },
      }
    },
    {
      $project: {
        totalClicks: 1,
        totalAttempts: 1,
        totalCompletions: 1,
      }
    }
  ]);

const getTotalStatsByTime = async (timePeriod = 'day') => {
  let dateFormat, dateFilter;
  switch (timePeriod) {
    case 'day':
      dateFormat = { day: { $dayOfMonth: "$clickedAt" }, month: { $month: "$clickedAt" }, year: { $year: "$clickedAt" } };
      break;
    case 'month':
      dateFormat = { month: { $month: "$clickedAt" }, year: { $year: "$clickedAt" } };
      break;
    case 'week':
      dateFormat = { week: { $week: "$clickedAt" }, year: { $year: "$clickedAt" } }
      break;
    default:
      dateFormat = { day: { $dayOfMonth: "$clickedAt" }, month: { $month: "$clickedAt" }, year: { $year: "$clickedAt" } };
  }
  switch (timePeriod) {
    case 'day':
      dateFilter = { clickedAt: { $gte: moment().startOf("day").subtract(15, "day").toDate(), $lte: moment().endOf("day").toDate() } }
      break;
    case 'month':
      dateFilter = { clickedAt: { $gte: moment().startOf("month").subtract(12, "month").toDate(), $lte: moment().endOf("month").toDate() } }
      break;
    case 'week':
      dateFilter = { clickedAt: { $gte: moment().startOf("week").subtract(10, "week").toDate(), $lte: moment().endOf("week").toDate() } }
      break;
    default:
      dateFilter = { clickedAt: { $gte: moment().startOf("day").subtract(15, "day").toDate(), $lte: moment().endOf("day").toDate() } }
  }
  return await AffiliateModel.aggregate([
    {
      $match: { ...dateFilter }
    },
    {
      $group: {
        _id: { ...dateFormat },
        clicks: { $sum: 1 },
        attempts: { $sum: { $cond: [{ $eq: ["$attempted", true] }, 1, 0] } },
        completions: { $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] } }
      }
    },
    {
      $project: {
        date: "$_id",
        referrerName: "$referrerDetails.name",
        clicks: 1,
        attempts: 1,
        completions: 1,
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.week": 1, "_id.day": 1 } }
  ]);
};

const AffiliateService2 = {
  findOrCreateAffiliate,
  setAffiliateAttempted,
  setAffiliateCompleted,
  getAgencyMonthlyAffiliateStats,
  getAgencyTotalAffiliateStats,
  getTotalAffiliateStatsByTime: getTotalStatsByTime,
  getTotalAffiliateStatsByAgency,
}

module.exports = AffiliateService2;