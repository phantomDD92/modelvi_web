const mongoose = require("mongoose");
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

const getTotalAffiliateStats = (agencyId) =>
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

const getMonthlyAffiliateStats = (agencyId, year) =>
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

const AffiliateService2 = {
  findOrCreateAffiliate,
  setAffiliateAttempted,
  setAffiliateCompleted,
  getMonthlyAffiliateStats,
  getTotalAffiliateStats,
}

module.exports = AffiliateService2;