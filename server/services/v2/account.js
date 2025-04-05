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

const AccountService2 = {
  getAccountWithModel,
  getAccountWithModelChat,
  updateRevenue,
  disableAccount,
  extendAccount,
  findAgencyAccounts,
};

module.exports = AccountService2;