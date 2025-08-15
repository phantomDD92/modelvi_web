const moment = require('moment');
const { default: mongoose } = require("mongoose");
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

const getFeeStatsByAgency = () => {
  const oneMonthAgo = moment().subtract(30, "day").toDate()
  return AccountModel.aggregate([
    {
      $match: {
        updatedAt: { $gte: oneMonthAgo }
      }
    },
    {
      $group: {
        _id: "$owner",
        monthlyFee: { $sum: { $ifNull: ["$fee", 50] } },        // Count the number of documents in each group
      }
    },
  ]);
}

const changeModelNumber = (modelId, number) =>
  AccountModel.updateMany({ actor: modelId }, { $set: { number } });

const syncContents = (modelId) =>
  AccountModel.updateMany({ actor: modelId }, { $set: { "params.uploaded": false, "params.recent": false } })

const syncBulkContents = (modelIds) =>
  AccountModel.updateMany({ actor: { $in: modelIds } }, { $set: { "params.uploaded": false, "params.recent": false } })

const changeOwner = (modelId, agencyId) =>
  AccountModel.updateMany({ actor: modelId }, { $set: { owner: agencyId } });

const loadAccounts = (platform, { agency, search }) => {
  const agencyQuery = agency ? { owner: agency, platform } : { platform };
  const searchQuery = search
    ? isNaN(Number(search))
      ? { alias: { $regex: search, $options: "i" } }
      : {
        $or: [
          { alias: { $regex: search, $options: "i" } },
          { number: Number(search) },
        ]
      }
    : {}
  const query = {
    ...agencyQuery,
    ...searchQuery,
  }
  return AccountModel.find(query, "-params.contents")
    .sort({ owner: 1, number: 1 })
    .populate("owner", "name")
    .populate("actor", "name")
    .populate("chatTeam", "name")
}

const loadAgencyAccounts = (platform, agencyId, search) => {
  const agencyQuery = { owner: agencyId, platform };
  const searchQuery = search
    ? isNaN(Number(search))
      ? { alias: { $regex: search, $options: "i" } }
      : {
        $or: [
          { alias: { $regex: search, $options: "i" } },
          { number: Number(search) },
        ]
      }
    : {}
  const query = {
    ...agencyQuery,
    ...searchQuery,
  }
  return AccountModel.find(query, "-params.contents")
    .sort({ owner: 1, number: 1 })
    .populate("owner", "name")
    .populate("actor", "name")
    .populate("chatTeam", "name")
}

const findAccountByAlias = (platform, alias) =>
  AccountModel.findOne({ platform, alias });

const createAccount = (
  platform,
  model,
  { alias, email, password, chatTeam, description, creator, device, proxy },
) =>
  AccountModel.create({
    platform,
    actor: model._id,
    number: model.number,
    owner: model.owner,
    alias,
    email: email || "-",
    password: password || "-",
    chatTeam,
    description,
    device,
    creator,
    proxy
  });

const findAccountById = (accountId) =>
  AccountModel.findById(accountId, "-params.contents")
    .populate("actor", "number name")
    .populate("owner", "name");

const deleteAccount = (accountId) =>
  AccountModel.findByIdAndDelete(accountId);

const updateAccount = (
  accountId,
  model,
  { alias, email, password, chatTeam, description, device }
) =>
  AccountModel.findByIdAndUpdate(accountId, {
    $set: {
      actor: model._id,
      number: model.number,
      owner: model.owner,
      alias,
      email: email || "-",
      device,
      password: password || "-",
      chatTeam: chatTeam || null,
      description,
    },
  });

const setStatus = (accountId, status) =>
  AccountModel.findByIdAndUpdate(accountId, { $set: { status, "params.balanceNextTime": new Date() } });

const clearError = (accountId) =>
  AccountModel.findByIdAndUpdate(accountId, { $set: { lastError: "" } })

const updateParams = (accountId, params) =>
  AccountModel.findByIdAndUpdate(accountId, { $set: params });

const getAccounts = (accountIds, agencyId = undefined) =>
  agencyId
    ? AccountModel.find({ _id: { $in: accountIds }, owner: agencyId }, "platform alias owner actor chatTeam")
      .populate("actor", "number name")
      .populate("owner", "name")
    : AccountModel.find({ _id: { $in: accountIds } }, "platform alias actor chatTeam")
      .populate("actor", "number name")
      .populate("owner", "name")

const updateAccountsStatus = (accountIds, status) =>
  AccountModel.updateMany({ _id: { $in: accountIds } }, { $set: { status } })

const deleteAccounts = (accountIds) =>
  AccountModel.deleteMany({ _id: { $in: accountIds } });

const getAgencyAccounts = (agencyId) =>
  AccountModel.find({ owner: agencyId }, "platform number actor alias")
    .populate("actor", "number name")
    .sort({ platform: 1, number: 1 });

const getModelAccounts = (modelId, platforms) =>
  AccountModel.find({ actor: modelId, platform: { $in: platforms } }, "platform number alias");

const removeChatTeam = (teamId) =>
  AccountModel.updateMany({ chatTeam: teamId }, { $set: { chatTeam: undefined } });

const removeChatTeams = (teamIds) =>
  AccountModel.updateMany({ chatTeam: { $in: teamIds } }, { $set: { chatTeam: undefined } });

const getStatsByChatTeam = () =>
  AccountModel.aggregate([
    {
      $match: {
        chatTeam: { $exists: true, $ne: null }
      }
    },
    {
      $group: {
        _id: "$chatTeam",
        actorCount: { $addToSet: "$actor" },
        accountCount: { $sum: 1 }
      }
    },
    {
      $project: {
        chatTeam: "$_id",
        actorCount: { $size: "$actorCount" },
        accountCount: 1
      }
    }
  ]);

const getStatsForChatTeam = (teamId) =>
  AccountModel.aggregate([
    {
      $match: { chatTeam: new mongoose.Types.ObjectId(teamId) }
    },
    {
      $group: {
        _id: "$chatTeam",
        actors: { $addToSet: "$actor" },
        accounts: { $addToSet: "$_id" }
      }
    },
    {
      $project: {
        actors: 1,
        accounts: 1
      }
    }
  ]);

const getCountStats = (agencyId) =>
  AccountModel.aggregate([
    {
      $match: agencyId ? { owner: agencyId } : {}
    },
    {
      $group: {
        _id: "$platform",
        totalAccounts: { $sum: 1 },
        disabledAccounts: {
          $sum: { $cond: [{ $eq: ["$status", false] }, 1, 0] }
        },
        runningAccounts: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$status", true] },
                  { $gte: ["$updatedAt", new Date(Date.now() - 10 * 60 * 1000)] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $project: {
        platform: "$_id",
        totalAccounts: 1,
        disabledAccounts: 1,
        runningAccounts: 1,
        _id: 0
      }
    },
    { $sort: { platform: 1 } }
  ]);

const getDisabledAccounts = (agencyId) =>
  AccountModel.find(agencyId ? { owner: agencyId, status: false } : { status: false }, "-params")
    .sort("-updatedAt")
    .populate("owner", "name")
    .populate("actor", "number name");

const getExpiringAccounts = (agencyId) =>
  AccountModel.find(
    { owner: agencyId, status: true, expiredAt: { $lte: moment().endOf('day') } },
    'platform alias actor'
  ).populate('actor', 'number name');

const updateIdentifier = (accountId, { alias, identifier }) =>
  AccountModel.findByIdAndUpdate(accountId, { $set: { alias, identifier } });

const getAccountsForPlatform = (platform) =>
  AccountModel.find({ platform, status: true }, "alias");

const getIdentifiers = (platform) =>
  AccountModel.find({ platform, status: true }, "alias identifier")

const getAccount = (accountId) =>
  AccountModel.findById(accountId)
    .populate("actor", "number name")
    .populate("owner", "name");

const AccountService2 = {
  getAgencyAccounts,
  getAccountWithModel,
  getAccountWithModelChat,
  updateRevenue,
  disableAccount,
  extendAccount,
  findAgencyAccounts,
  getCountStatsByAgencyPlatform,
  getFeeStatsByAgency,
  changeModelNumber,
  syncContents,
  syncBulkContents,
  changeOwner,
  loadAccounts,
  loadAgencyAccounts,
  findAccountByAlias,
  findAccountById,
  createAccount,
  deleteAccount,
  updateAccount,
  setStatus,
  clearError,
  updateParams,
  getAccounts,
  updateAccountsStatus,
  deleteAccounts,
  getModelAccounts,
  removeChatTeam,
  removeChatTeams,
  getStatsByChatTeam,

  getCountStats,
  getDisabledAccounts,
  getExpiringAccounts,
  updateIdentifier,
  getAccountsForPlatform,
  getIdentifiers,
  getAccount,
};

module.exports = AccountService2;