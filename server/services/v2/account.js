const AccountModel = require("../../models/account");

const updateRevenue = (accountId, revenue, fee) =>
  AccountModel.findByIdAndUpdate(accountId, { $set: { revenue, fee, "params.balanceNextTime": new Date(Date.now() + (3600 * 1000 * 24)) } })

const getAccountWithModel = (accountId, fields) =>
  AccountModel.findById(accountId, fields).populate("actor", "number name");

const disableAccount = (accountId, reason) =>
  AccountModel.findByIdAndUpdate(accountId, { $set: { status: false, lastError: reason } })

const extendAccount = (accountId) =>
  AccountModel.findByIdAndUpdate(accountId, { $set: { expiredAt: new Date(Date.now() + (3600 * 1000 * 24 * 30)) } })

const getAccountWithModelChat = (accountId) =>
  AccountModel.findById(accountId)
    .populate("actor", "number name")
    .populate("chatTeam", "discord");

const findAgencyAccounts = (agencyId) =>
  AccountModel.find({ owner: agencyId });

const getCountStatsByAgencyPlatform = () =>
  AccountModel.aggregate([
    {
      $group: {
        _id: {
          creator: "$owner",     // Group by creator
          platform: "$platform"    // and platform
        },
        count: { $sum: 1 },        // Count the number of documents in each group
      }
    },
    {
      $project: {
        creator: "$_id.creator",  // Flatten the fields
        platform: "$_id.platform",
        count: 1,
      }
    }
  ]);

const getFeeStatsByAgency = () =>
  AccountModel.aggregate([
    {
      $group: {
        _id: "$owner",
        monthlyFee: { $sum: { $ifNull: ["$fee", 50] } },        // Count the number of documents in each group
      }
    },
  ]);

const AccountService2 = {
  getAccountWithModel,
  getAccountWithModelChat,
  updateRevenue,
  disableAccount,
  extendAccount,
  findAgencyAccounts,
  getCountStatsByAgencyPlatform,
  getFeeStatsByAgency,
};

module.exports = AccountService2;