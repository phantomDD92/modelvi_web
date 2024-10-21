const { Platform, AdminRole } = require("../config/const");
const AccountModel = require("../models/account");

const loadAccounts = (agency, platform, { page, pageSize }) =>
  Promise.all([
    AccountModel.find(agency.role == AdminRole.AGENCY ? { platform, owner: agency._id } : { platform })
      .sort("number")
      .skip((parseInt(page) - 1) * parseInt(pageSize))
      .limit(parseInt(pageSize))
      .populate("owner", "name")
      .populate("actor", "name"),
    AccountModel.countDocuments(agency.role == AdminRole.AGENCY ? { platform, owner: agency._id } : { platform })
  ])


const createAccount = (
  platform,
  actor,
  { alias, email, password, discord, description, owner, creator, device }
) =>
  AccountModel.create({
    platform,
    actor: actor._id,
    number: actor.number,
    alias,
    email,
    password,
    discord,
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
  { alias, email, password, discord, description, device }
) =>
  AccountModel.findByIdAndUpdate(id, {
    $set: {
      actor: actor._id,
      number: actor.number,
      alias,
      email,
      device,
      password,
      discord,
      description,
    },
  });

const setStatus = (id, status) =>
  AccountModel.findByIdAndUpdate(id, { $set: { status } });

const clearError = (id) => AccountModel.findByIdAndUpdate(id, { $set: { lastError: "" } })

const deleteAccount = (id) =>
  AccountModel.findByIdAndDelete(id);

const findById = (id) =>
  AccountModel.findById(id);

const getCount = (agency) =>
  Promise.all([
    AccountModel.countDocuments(agency.role == AdminRole.AGENCY ? { owner: agency._id, platform: Platform.F2F } : { platform: Platform.F2F }),
    AccountModel.countDocuments(agency.role == AdminRole.AGENCY ? { owner: agency._id, platform: Platform.FNC } : { platform: Platform.FNC })
  ]);

const updateParams = (accountId, params) =>
  AccountModel.findByIdAndUpdate(accountId, { $set: params });

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
  AccountModel.find({ platform }, 'alias')

const findByIdAndUpdateTime = (id) => 
  AccountModel.findByIdAndUpdate(id, {$set: {updatedAt: new Date()}})

const clearContents = (accountId) =>
  AccountModel.findByIdAndUpdate(accountId, { $set: { "params.contents": [] } })

const setContents = (accountId, contents) => {
  const newContents = contents.map(({ image, folder, title, tags }) => ({ image, folder, title, tags }));
  return AccountModel.findByIdAndUpdate(accountId, {
      $push: { "params.contents": { $each: newContents } },
      $set: { "params.recent": true, "params.uploaded": false }
  });
}
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
};

module.exports = AccountService;
