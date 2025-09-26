const moment = require('moment');
const { default: mongoose } = require("mongoose");

const AccountModel = require("../../models/account");

const updateRevenue = (accountId, revenue, fee) =>
  AccountModel.findByIdAndUpdate(accountId, { $set: { revenue, fee, "params.balanceNextTime": new Date(Date.now() + (3600 * 1000 * 24)) } })

const getAccountWithModel = (accountId, fields) =>
  AccountModel.findById(accountId, fields).populate("actor", "number name");

const getAccountWithAgencyAndModel = (accountId) =>
  AccountModel.findById(accountId, "-params").populate("actor", "number name").populate("owner", "name discord");

const disableAccount = (accountId, reason) =>
  AccountModel.findByIdAndUpdate(accountId, { $set: { status: false, lastError: reason } })

const extendAccount = (accountId) =>
  AccountModel.findByIdAndUpdate(accountId, { $set: { expiredAt: new Date(Date.now() + (3600 * 1000 * 24 * 30)) } })

const getAccountWithModelChat = (accountId) =>
  AccountModel.findById(accountId)
    .populate("actor", "number name")
    .populate("chatTeam", "discord");

const findAgencyAccounts = (agencyId) =>
  AccountModel.find({ owner: agencyId, deleted: false });

const getCountStatsByAgencyPlatform = () =>
  AccountModel.aggregate([
    {
      $match: {
        deleted: false
      }
    },
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
  // const oneMonthAgo = moment().subtract(30, "day").toDate()
  return AccountModel.aggregate([
    {
      $match: {
        expiredAt: { $gte: moment().startOf("day").toDate() }
      }
    },
    {
      $group: {
        _id: "$owner",
        monthlyFee: { $sum: { $ifNull: ["$fee", 50] } },
        proxyFee: { $sum: 2.5 },        // Count the number of documents in each group
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
  const agencyQuery = agency ? { owner: agency } : {};
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
    platform,
    deleted: false,
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
    deleted: false,
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
    proxy,
    expiredAt: moment().subtract(1, "day").toDate(),
  });

const findAccountById = (accountId) =>
  AccountModel.findById(accountId, "-params.contents")
    .populate("actor", "number name")
    .populate("owner", "name");

const deleteAccount = (accountId) =>
  AccountModel.findByIdAndUpdate(accountId, { deleted: true });

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

const updateParameters = (accountId, params) =>
  AccountModel.findByIdAndUpdate(accountId, params);

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
  AccountModel.updateMany({ _id: { $in: accountIds } }, { $set: { deleted: true } });

const getAgencyAccounts = (agencyId) =>
  AccountModel.find({ owner: agencyId, deleted: false }, "platform number actor alias")
    .populate("actor", "number name")
    .sort({ platform: 1, number: 1 });

const getModelAccounts = (modelId, platforms) =>
  AccountModel.find({ actor: modelId, deleted: false, platform: { $in: platforms } }, "platform number alias");

const removeChatTeam = (teamId) =>
  AccountModel.updateMany({ chatTeam: teamId }, { $set: { chatTeam: undefined } });

const removeChatTeams = (teamIds) =>
  AccountModel.updateMany({ chatTeam: { $in: teamIds } }, { $set: { chatTeam: undefined } });

const getStatsByChatTeam = () =>
  AccountModel.aggregate([
    {
      $match: {
        deleted: false,
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
      $match: agencyId ? { owner: agencyId, deleted: false } : { deleted: false }
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
  AccountModel.find(agencyId ? { owner: agencyId, status: false, deleted: false } : { status: false, deleted: false }, "-params")
    .sort("-updatedAt")
    .populate("owner", "name")
    .populate("actor", "number name");

const getExpiringAccounts = (agencyId) =>
  AccountModel.find(
    { owner: agencyId, status: true, deleted: false, expiredAt: { $lte: moment().endOf('day') } },
    'platform alias actor'
  ).populate('actor', 'number name');

const updateIdentifier = (accountId, { alias, identifier }) =>
  AccountModel.findByIdAndUpdate(accountId, { $set: { alias, identifier } });

const getLivingAccountsForPlatform = (platform) =>
  AccountModel.find({ platform, status: true, deleted: false }, "alias");

const getIdentifiers = (platform) =>
  AccountModel.find({ platform, status: true, deleted: false }, "alias identifier")

const getAccount = (accountId) =>
  AccountModel.findById(accountId)
    .populate("actor", "number name")
    .populate("owner", "name");

const changeProxy = (accountId, proxy) =>
  AccountModel.findByIdAndUpdate(accountId, { $set: { proxy } });

const clearContents = (accountId) =>
  AccountModel.findByIdAndUpdate(accountId, { $set: { "params.contents": [] } })

const setContents = (accountId, contents) => {
  const newContents = contents.map(({ _id, platforms, ...params }) => ({ ...params }));
  return AccountModel.findByIdAndUpdate(accountId, {
    $push: { "params.contents": { $each: newContents } },
    $set: { "params.recent": true, "params.uploaded": false, "contentsLength": newContents.length }
  });
}

const getAgencyModelsRevenue = (agencyId) => {
  return AccountModel.aggregate([
    {
      $match: {
        owner: agencyId,
        expiredAt: { $gte: moment().startOf("day").toDate() }
      }
    },
    {
      $group:
      {
        _id: {
          actor: "$actor",
          owner: "$owner"
        },
        accounts: {
          $push: {
            platform: "$platform",
            alias: "$alias",
            revenue: "$revenue"
          }
        },
        revenue: {
          $sum: "$revenue"
        }
      }
    },
    {
      $project: {
        _id: "$_id.actor",
        revenue: 1,
        accounts: 1,
      }
    }
  ])
}

const getModelsRevenue = () => {
  return AccountModel.aggregate([
    {
      $match: {
        expiredAt: { $gte: moment().startOf("day").toDate() }
      }
    },
    {
      $group:
      {
        _id: {
          actor: "$actor",
          owner: "$owner"
        },
        accounts: {
          $push: {
            platform: "$platform",
            alias: "$alias",
            revenue: "$revenue"
          }
        },
        revenue: {
          $sum: "$revenue"
        }
      }
    },
    {
      $project: {
        _id: "$_id.actor",
        revenue: 1,
        accounts: 1,
      }
    }
  ])
}

const getAgenciesRevenue = () => {
  return AccountModel.aggregate([
    {
      $match: {
        expiredAt: { $gte: moment().startOf("day").toDate() }
      }
    },
    {
      $group:
      {
        _id: {
          actor: "$actor",
          owner: "$owner"
        },
        accounts: {
          $push: {
            platform: "$platform",
            alias: "$alias",
            revenue: "$revenue"
          }
        },
        count: { $sum: 1 },
        revenue: {
          $sum: "$revenue"
        }
      }
    },
    {
      $group: {
        _id: "$_id.owner",
        models: {
          $push: {
            model: "$_id.actor",
            revenue: "$revenue",
            count: "$count",
            // accounts: "$accounts",
          },
        },
        count: { $sum: "$count" }
      }
    }
  ])
}

const AccountService2 = {
  getAgencyAccounts,
  getAccountWithModel,
  getAccountWithModelChat,
  getAccountWithAgencyAndModel,
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
  updateParameters,
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
  getLivingAccountsForPlatform,
  getIdentifiers,
  getAccount,
  changeProxy,
  clearContents,
  setContents,

  getAgencyModelsRevenue,
  getModelsRevenue,
  getAgenciesRevenue
};

module.exports = AccountService2;