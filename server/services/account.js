const { Platform, AdminRole } = require("../config/const");
const AccountModel = require("../models/account");
const moment = require('moment');

const loadAccounts = (agency, platform, { page, pageSize }) =>
  Promise.all([
    AccountModel.find(agency.role == AdminRole.AGENCY ? { platform, owner: agency._id } : { platform })
      .sort({ owner: 1, number: 1 })
      .skip((parseInt(page) - 1) * parseInt(pageSize))
      .limit(parseInt(pageSize))
      .populate("owner", "name")
      .populate("actor", "name")
      .populate("chatTeam", "name"),
    AccountModel.countDocuments(agency.role == AdminRole.AGENCY ? { platform, owner: agency._id } : { platform })
  ])

const loadDisabledAccounts = (agency) =>
  AccountModel.find(agency.role == AdminRole.AGENCY ? { owner: agency._id, status: false } : { status: false })
    .sort("-updatedAt")
    .populate("owner", "name")
    .populate("actor", "name");

const createAccount = (
  platform,
  actor,
  { alias, email, password, chatTeam, description, owner, creator, device }
) =>
  AccountModel.create({
    platform,
    actor: actor._id,
    number: actor.number,
    alias,
    email,
    password,
    chatTeam,
    description,
    owner,
    device,
    creator,
    params: platform == "F2F"
      ? {
        commentInterval: 10,
        notifyInterval: 10,
        postOffsets: [1, 21, 51],
        recent: false,
        uploaded: false,
        debug: false,
      } : undefined
  });

const updateAccount = (
  id,
  actor,
  { alias, email, password, chatTeam, description, device }
) =>
  AccountModel.findByIdAndUpdate(id, {
    $set: {
      actor: actor._id,
      number: actor.number,
      alias,
      email,
      device,
      password,
      chatTeam,
      description,
    },
  });

const setStatus = (id, status) =>
  AccountModel.findByIdAndUpdate(id, { $set: { status } });

const clearError = (id) => AccountModel.findByIdAndUpdate(id, { $set: { lastError: "" } })

const deleteAccount = (id) =>
  AccountModel.findByIdAndDelete(id);

const findById = (id) =>
  AccountModel.findById(id).populate("actor", "number name");

const getCount = (agency) =>
  Promise.all([
    AccountModel.countDocuments(agency.role == AdminRole.AGENCY ? { owner: agency._id, platform: Platform.F2F } : { platform: Platform.F2F }),
    AccountModel.countDocuments(agency.role == AdminRole.AGENCY ? { owner: agency._id, platform: Platform.F2F, status: false } : { platform: Platform.F2F, status: false }),
    AccountModel.countDocuments(agency.role == AdminRole.AGENCY ? { owner: agency._id, platform: Platform.F2F, updatedAt: { $gte: moment().subtract(10, 'minute').toDate() } } : { platform: Platform.F2F, updatedAt: { $gte: moment().subtract(10, 'minute').toDate() } }),
    AccountModel.countDocuments(agency.role == AdminRole.AGENCY ? { owner: agency._id, platform: Platform.FNC } : { platform: Platform.FNC }),
    AccountModel.countDocuments(agency.role == AdminRole.AGENCY ? { owner: agency._id, platform: Platform.FNC, status: false } : { platform: Platform.FNC, status: false }),
    AccountModel.countDocuments(agency.role == AdminRole.AGENCY ? { owner: agency._id, platform: Platform.FNC, updatedAt: { $gte: moment().subtract(10, 'minute').toDate() } } : { platform: Platform.FNC, updatedAt: { $gte: moment().subtract(10, 'minute').toDate() } }),
    AccountModel.countDocuments(agency.role == AdminRole.AGENCY ? { owner: agency._id, platform: Platform.FAN } : { platform: Platform.FAN }),
    AccountModel.countDocuments(agency.role == AdminRole.AGENCY ? { owner: agency._id, platform: Platform.FAN, status: false } : { platform: Platform.FAN, status: false }),
    AccountModel.countDocuments(agency.role == AdminRole.AGENCY ? { owner: agency._id, platform: Platform.FAN, updatedAt: { $gte: moment().subtract(10, 'minute').toDate() } } : { platform: Platform.FAN, updatedAt: { $gte: moment().subtract(10, 'minute').toDate() } }),
    AccountModel.countDocuments(agency.role == AdminRole.AGENCY ? { owner: agency._id, platform: Platform.FANVUE } : { platform: Platform.FANVUE }),
    AccountModel.countDocuments(agency.role == AdminRole.AGENCY ? { owner: agency._id, platform: Platform.FANVUE, status: false } : { platform: Platform.FANVUE, status: false }),
    AccountModel.countDocuments(agency.role == AdminRole.AGENCY ? { owner: agency._id, platform: Platform.FANVUE, updatedAt: { $gte: moment().subtract(10, 'minute').toDate() } } : { platform: Platform.FANVUE, updatedAt: { $gte: moment().subtract(10, 'minute').toDate() } }),
    AccountModel.countDocuments(agency.role == AdminRole.AGENCY ? { owner: agency._id, platform: Platform.KNKY } : { platform: Platform.KNKY }),
    AccountModel.countDocuments(agency.role == AdminRole.AGENCY ? { owner: agency._id, platform: Platform.KNKY, status: false } : { platform: Platform.KNKY, status: false }),
    AccountModel.countDocuments(agency.role == AdminRole.AGENCY ? { owner: agency._id, platform: Platform.KNKY, updatedAt: { $gte: moment().subtract(10, 'minute').toDate() } } : { platform: Platform.KNKY, updatedAt: { $gte: moment().subtract(10, 'minute').toDate() } }),
    AccountModel.countDocuments(agency.role == AdminRole.AGENCY ? { owner: agency._id, platform: Platform.MALOUM } : { platform: Platform.MALOUM }),
    AccountModel.countDocuments(agency.role == AdminRole.AGENCY ? { owner: agency._id, platform: Platform.MALOUM, status: false } : { platform: Platform.MALOUM, status: false }),
    AccountModel.countDocuments(agency.role == AdminRole.AGENCY ? { owner: agency._id, platform: Platform.MALOUM, updatedAt: { $gte: moment().subtract(10, 'minute').toDate() } } : { platform: Platform.MALOUM, updatedAt: { $gte: moment().subtract(10, 'minute').toDate() } }),
  ]);

const updateParams = (accountId, params) =>
  AccountModel.findByIdAndUpdate(accountId, { $set: params });

const updateParameter = (accountId, params) =>
  AccountModel.findByIdAndUpdate(accountId, params);

const syncContents = (actorId) =>
  AccountModel.updateMany({ actor: actorId }, { $set: { "params.uploaded": false, "params.recent": false } })

const setAllStatus = (platform, status) =>
  AccountModel.updateMany({ platform }, { $set: { status } })

const setAgencyStatus = (agency, platform, status) =>
  AccountModel.updateMany({ platform, owner: agency._id }, { $set: { status } })

const findByActor = (platform, actorId) =>
  AccountModel.findOne({ platform, actor: actorId });

const getAgencyCount = (agencyId) =>
  AccountModel.countDocuments({ creator: agencyId })

// update all account params belongs to actor
const updateParamsForActor = (actorId, params) =>
  AccountModel.updateMany({ actor: actorId }, { $set: params });

const findByAlias = (platform, alias) =>
  AccountModel.findOne({ platform, alias })

const getAccountNames = (platform) =>
  AccountModel.find({ platform, status: true }, 'alias')

const findByIdAndUpdateTime = (id) =>
  AccountModel.findByIdAndUpdate(id, { $set: { updatedAt: new Date() } })

const clearContents = (accountId) =>
  AccountModel.findByIdAndUpdate(accountId, { $set: { "params.contents": [] } })

const setContents = (accountId, contents) => {
  const newContents = contents.map(({ _id, platforms, ...params }) => ({ ...params }));
  return AccountModel.findByIdAndUpdate(accountId, {
    $push: { "params.contents": { $each: newContents } },
    $set: { "params.recent": true, "params.uploaded": false }
  });
}

const replaceContents = (accountId, contents) => {
  return AccountModel.findByIdAndUpdate(accountId, {
    $set: { "params.contents": contents }
  });

}


const releaseAccounts = (platform, console) =>
  AccountModel.updateMany({ platform, console }, { $set: { console: "" } });

const allocateAccounts = async (platform, console, count) => {
  // const session = await mongoose.startSession();
  // try {
  //   session.startTransaction();
  //   const users = await AccountModel.find({ console: "", status: true }).limit(count).session(session);
  //   if (users.length)
  // } catch (error) {

  // }
}

const changeAgency = (actor, agency) =>
  AccountModel.updateMany({ actor }, { $set: { owner: agency } });

const getStats = () =>
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
  ])

// Update account number for a model
const updateNumber = (actorId, number) =>
  AccountModel.updateMany(
    { actor: actorId },
    { $set: { number } }
  );

const setChatTeam = (accountId, teamId) =>
  AccountModel.findByIdAndUpdate(accountId, { $set: { chatTeam: teamId } })

const AccountService = {
  loadAccounts,
  createAccount,
  updateAccount,
  setStatus,
  deleteAccount,
  findById,
  findByActor,
  getCount,
  updateParams,
  updateParameter,
  syncContents,
  clearContents,
  setContents,
  clearError,
  setAllStatus,
  setAgencyStatus,
  getAgencyCount,
  updateParamsForActor,
  findByIdAndUpdateTime,
  findByAlias,
  getAccountNames,

  replaceContents,
  changeAgency,
  releaseAccounts,
  allocateAccounts,
  loadDisabledAccounts,

  getStats,
  updateNumber, // update accounts' number for model
  setChatTeam
};

module.exports = AccountService;
