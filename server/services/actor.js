const { AdminRole } = require("../config/const");
const ActorModel = require("../models/actor");

const createActor = ({
  number,
  name,
  birthday,
  birthplace,
  owner
}) => ActorModel.create({
  number,
  name,
  birthday,
  birthplace,
  owner
});


const updateActor = (
  id,
  { number, name, birthday, birthplace, owner }
) =>
  ActorModel.findByIdAndUpdate(id, {
    $set: {
      number,
      name,
      birthday,
      birthplace,
      owner,
    },
  });

const deleteActor = (id) => ActorModel.deleteOne({ _id: id });

const appendAccount = (id, account) =>
  ActorModel.findByIdAndUpdate(id, { $push: { accounts: account._id } });

const removeAccount = (id, account) =>
  ActorModel.findByIdAndUpdate(id, { $pull: { accounts: account._id } });

const loadActors = (agency, { page, pageSize }) =>
  Promise.all([
    ActorModel.find(agency.role == AdminRole.AGENCY ? {owner: agency._id} : {})
      .sort("number")
      .skip((parseInt(page) - 1) * parseInt(pageSize))
      .limit(parseInt(pageSize))
      .populate("owner", "name")
      .populate("accounts", "platform alias"),
    ActorModel.countDocuments(agency.role == AdminRole.AGENCY ? {owner: agency._id} : {})
  ])

const loadAllActors = (agency) =>
  ActorModel.find(agency.role == AdminRole.AGENCY ? {owner: agency._id} : {}, "number name");

const findByNumber = (number) => ActorModel.findOne({ number });

const findByName = (name) => ActorModel.findOne({ name });

const findById = (id) => ActorModel.findById(id);

const getCount = (agency) => ActorModel.countDocuments(agency.role == AdminRole.AGENCY ? {owner: agency._id} : {})

const setDiscord = (id, discord) => ActorModel.findByIdAndUpdate(id, { $set: { discord } });

const clearDiscord = (id) => ActorModel.findByIdAndUpdate(id, { $set: { discord: null } });

const appendContent = (id, { image, folder, title, tags }) =>
  ActorModel.findByIdAndUpdate(id, { $push: { contents: { image, folder, title, tags } }, $set: { updated: true } });

const deleteContent = (id, contentId) =>
  ActorModel.findByIdAndUpdate(id, { $pull: { contents: { _id: contentId } }, $set: { updated: true } })

const clearContents = (id) =>
  ActorModel.findByIdAndUpdate(id, { $set: { contents: [], updated: true } })

const syncContents = (id) =>
  ActorModel.findByIdAndUpdate(id, { $set: { updated: false } })

const updateContent = (id, contentId, params) =>
  ActorModel.findOneAndUpdate({ _id: id, 'contents._id': contentId }, { $set: { 'contents.$': params } })

const getActorCount = (agencyId) =>
  ActorModel.countDocuments({ owner: agencyId });

const updateProfile = (id, params) =>
  ActorModel.findByIdAndUpdate(id, { $set: { profile: params } })

const ActorService = {
  createActor,
  updateActor,
  deleteActor,
  appendAccount,
  removeAccount,
  loadActors,
  findByName,
  findByNumber,
  findById,
  getCount,
  setDiscord,
  clearDiscord,
  appendContent,
  deleteContent,
  clearContents,
  updateContent,
  syncContents,
  loadAllActors,
  getActorCount,

  // profile
  updateProfile,
};

module.exports = ActorService;
