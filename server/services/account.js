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
  { alias, email, password, discord, description, owner, creator }
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
  { alias, email, password, discord, description }
) =>
  AccountModel.findByIdAndUpdate(id, {
    $set: {
      actor: actor._id,
      number: actor.number,
      alias,
      email,
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

const getCount = () =>
  Promise.all([
    AccountModel.countDocuments({ platform: Platform.F2F })
  ]);

const updateParams = async (accountId, params) =>
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
  clearError,
  setAllStatus,
  setAgencyStatus,
  getAgencyCount,
  updateParamsForActor,
};

module.exports = AccountService;
