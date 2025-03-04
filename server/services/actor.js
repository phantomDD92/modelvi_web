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


const changeActor = (
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

const deleteActor = (id) => ActorModel.findByIdAndDelete(id);

const deleteActors = (actorIds) =>
  ActorModel.deleteMany({ _id: { $in: actorIds } });

const appendAccount = (id, account) =>
  ActorModel.findByIdAndUpdate(id, { $push: { accounts: account._id }, $set: { updated: true } });

const removeAccount = (id, account) =>
  ActorModel.findByIdAndUpdate(id, { $pull: { accounts: account._id } });

const loadActors = (agency) =>
  agency.role == AdminRole.MANAGER
    ? ActorModel.find({}, "-contents")
      .sort({ owner: 1, number: 1 })
      .populate("owner", "name")
      .populate("accounts", "platform alias")
    : ActorModel.find({ owner: agency._id }, "-contents")
      .sort({ owner: 1, number: 1 })
      .populate("owner", "name")
      .populate("accounts", "platform alias")

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
  ActorModel.findByIdAndUpdate(id, { $push: { contents: params }, $set: { updated: true }, $inc: { contentsLength: 1 } });

const deleteContent = (id, contentId) =>
  ActorModel.findByIdAndUpdate(id, { $pull: { contents: { _id: contentId } }, $set: { updated: true }, $inc: { contentsLength: -1 } })

const deleteBulkContents = (id, contentIds) =>
  ActorModel.findByIdAndUpdate(id, { $pull: { contents: { _id: { $in: contentIds } } }, $set: { updated: true }, $inc: { contentsLength: -1 * contentIds.length } })

const clearContents = (id) =>
  ActorModel.findByIdAndUpdate(id, { $set: { contents: [], updated: true, contentsLength: 0 } })

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

const getEmptyActors = (agency, modelIds) =>
  agency.role == AdminRole.MANAGER
    ? ActorModel.find({ _id: { $in: modelIds }, accounts: { $size: 0 } }, "-contents")
    : ActorModel.find({ _id: { $in: modelIds }, accounts: { $size: 0 }, owner: agency._id }, "-contents")

const updateBulkContentsParams = (actorId, contentIds, { platforms, story, knkyStoryType, knkyStoryPrice }) =>
  ActorModel.updateOne(
    { _id: actorId },
    {
      $set: {
        'contents.$[elem].platforms': platforms,
        'contents.$[elem].story': story,
        'contents.$[elem].knkyStoryType': knkyStoryType,
        'contents.$[elem].knkyStoryPrice': knkyStoryPrice
      }
    },
    { arrayFilters: [{ 'elem._id': { $in: contentIds } }] }
  )

const loadAll = () =>
  ActorModel.find();

const ActorService = {
  loadAll,
  createActor,
  changeActor,
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
  deleteBulkContents,
  updateBulkContentsParams,
  clearContents,
  updateContent,
  syncContents,
  getActorCount,
  changeAgency,
  // profile
  updateProfile,
  setContents,
  getStats,
  getEmptyActors,
  deleteActors,
};

module.exports = ActorService;
