const { AdminRole } = require("../config/const");
const ActorModel = require("../models/actor");

const createActor = ({
  number,
  name,
  birthday,
  birthplace,
  owner,
}) => ActorModel.create({
  number,
  name,
  birthday,
  birthplace,
  owner,
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
  ActorModel.findByIdAndUpdate(id, { $push: { accounts: account._id }, $set: { updated: true } });

const removeAccount = (id, account) =>
  ActorModel.findByIdAndUpdate(id, { $pull: { accounts: account._id } });

const loadActors = (agency, { page, pageSize }) =>
  Promise.all([
    ActorModel.find(agency.role == AdminRole.AGENCY ? { owner: agency._id } : {})
      .sort({ owner: 1, number: 1 })
      .skip((parseInt(page) - 1) * parseInt(pageSize))
      .limit(parseInt(pageSize))
      .populate("owner", "name")
      .populate("accounts", "platform alias"),
    ActorModel.countDocuments(agency.role == AdminRole.AGENCY ? { owner: agency._id } : {})
  ])

const loadAllActors = (agency) =>
  ActorModel
    .find(agency.role == AdminRole.AGENCY ? { owner: agency._id } : {}, "owner number name")
    .sort({ owner: 1, number: 1 })
    .populate("owner", "name");

const loadAll = () =>
  ActorModel.find();

const findByNumber = (agencyId, number) =>
  ActorModel.findOne({ owner: agencyId, number });

const findByName = (name) => ActorModel.findOne({ name });

const findById = (id) => ActorModel.findById(id);

const getCount = (agency) =>
  Promise.all([
    ActorModel.countDocuments(agency.role == AdminRole.AGENCY ? { owner: agency._id } : {}),
    ActorModel.countDocuments(agency.role == AdminRole.AGENCY ? { owner: agency._id, updated: true } : { updated: true }),
  ]);

const appendContent = (id, params) =>
  ActorModel.findByIdAndUpdate(id, { $push: { contents: params }, $set: { updated: true } });

const deleteContent = (id, contentId) =>
  ActorModel.findByIdAndUpdate(id, { $pull: { contents: { _id: contentId } }, $set: { updated: true } })

const clearContents = (id) =>
  ActorModel.findByIdAndUpdate(id, { $set: { contents: [], updated: true } })

const setContents = (id, contents) =>
  ActorModel.findByIdAndUpdate(id, { $set: { contents } });

const syncContents = (id) =>
  ActorModel.findByIdAndUpdate(id, { $set: { updated: false } })

const updateContent = (id, contentId, params) =>
  ActorModel.findOneAndUpdate({ _id: id, 'contents._id': contentId }, { $set: { 'contents.$': params }, updated: true })

const getActorCount = (agencyId) =>
  ActorModel.countDocuments({ owner: agencyId });

const updateProfile = (id, params) =>
  ActorModel.findByIdAndUpdate(id, { $set: { profile: params } })

const changeAgency = (id, agency) =>
  ActorModel.findByIdAndUpdate(id, { $set: { owner: agency } });

const getStats = () =>
  ActorModel.aggregate([
    {
      $group: {
        _id: {
          creator: "$owner",     // Group by creator
        },
        count: { $sum: 1 },        // Count the number of documents in each group
      }
    },
    {
      $project: {
        creator: "$_id.creator",  // Flatten the fields
        count: 1,
      }
    }
  ])

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
  appendContent,
  deleteContent,
  clearContents,
  updateContent,
  syncContents,
  loadAllActors,
  getActorCount,
  changeAgency,
  // profile
  updateProfile,
  loadAll,
  setContents,
  getStats
};

module.exports = ActorService;
