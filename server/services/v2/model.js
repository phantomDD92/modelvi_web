const ActorModel = require("../../models/actor");

const findAgencyModels = (agencyId) =>
  ActorModel.find({ owner: agencyId, deleted: false }, "-contents");

const getAgencyModelCount = (agencyId) =>
  ActorModel.countDocuments({ owner: agencyId, deleted: false });

const getCountStatsByAgency = () =>
  ActorModel.aggregate([
    {
      $match: { deleted: false },
    },
    {
      $group: {
        _id: "$owner",     // Group by creator
        count: { $sum: 1 }, // Count the number of documents in each group
      }
    },
    {
      $project: {
        _id: 1,  // Flatten the fields
        count: 1,
      }
    }
  ])

const loadModels = ({ search, agency }) => {
  const agencyQuery = agency ? { owner: agency } : {};
  const searchQuery = search
    ? isNaN(Number(search))
      ? { name: { $regex: search, $options: "i" } }
      : {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { number: Number(search) },
        ]
      }
    : {}
  const query = {
    deleted: false,
    ...agencyQuery,
    ...searchQuery,
  }
  return ActorModel.find(query, "-contents")
    .sort({ owner: 1, number: 1 })
    .populate("owner", "name")
    .populate("accounts", "platform alias revenue fee expiredAt");
}

const loadAgencyModels = (agencyId, search) => {
  const agencyQuery = { owner: agencyId };
  const searchQuery = search
    ? isNaN(Number(search))
      ? { name: { $regex: search, $options: "i" } }
      : {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { number: Number(search) },
        ]
      }
    : {}
  const query = {
    deleted: false,
    ...agencyQuery,
    ...searchQuery,
  }
  return ActorModel.find(query, "-contents")
    .sort({ number: 1 })
    .populate("owner", "name")
    .populate("accounts", "platform alias fee expiredAt");
}

const findModelByName = (agencyId, name) =>
  ActorModel.findOne({ owner: agencyId, name }, "-contents");

const findModelByNumber = (agencyId, number) =>
  ActorModel.findOne({ owner: agencyId, number }, "-contents");

const findModelById = (modelId) =>
  ActorModel.findById(modelId, "-contents").populate("owner", "name")

const getModel = (modelId) =>
  ActorModel.findById(modelId, "-contents");

const getModelWithContents = (modelId) =>
  ActorModel.findById(modelId).populate("owner", "name");

const deleteModel = (modelId) =>
  ActorModel.findByIdAndUpdate(modelId, { $set: { deleted: true } });

const deleteModels = (modelIds) =>
  ActorModel.updateMany({ _id: { $in: modelIds } }, { $set: { deleted: false } });

const findEmptyModels = (modelIds, agencyId) =>
  agencyId
    ? ActorModel.find({ _id: { $in: modelIds }, accounts: { $size: 0 }, owner: agencyId, deleted: false }, "-contents").populate("owner", "name")
    : ActorModel.find({ _id: { $in: modelIds }, accounts: { $size: 0 }, deleted: false }, "-contents").populate("owner", "name")

const changeModel = (modelId, { number, name, }) =>
  ActorModel.findByIdAndUpdate(modelId, { $set: { number, name, }, });

const changeOwner = (modelId, agencyId) =>
  ActorModel.findByIdAndUpdate(modelId, { $set: { owner: agencyId } });

const findModelsByIds = (modelIds, agencyId = undefined) =>
  agencyId
    ? ActorModel.find({ _id: { $in: modelIds }, owner: agencyId }, "-contents").populate("owner", "name")
    : ActorModel.find({ _id: { $in: modelIds } }, "-contents").populate("owner", "name");


const createModel = ({ number, name, owner, }) =>
  ActorModel.create({ number, name, owner, });

const appendContent = (modelId, params) =>
  ActorModel.findByIdAndUpdate(modelId, { $push: { contents: params }, $set: { updated: true }, $inc: { contentsLength: 1 } });

const deleteContent = (modelId, contentId) =>
  ActorModel.findByIdAndUpdate(modelId, { $pull: { contents: { _id: contentId } }, $set: { updated: true }, $inc: { contentsLength: -1 } })

const deleteContents = (modelId, contentIds) =>
  ActorModel.findByIdAndUpdate(modelId, { $pull: { contents: { _id: { $in: contentIds } } }, $set: { updated: true }, $inc: { contentsLength: -1 * contentIds.length } })

const clearContents = (modelId) =>
  ActorModel.findByIdAndUpdate(modelId, { $set: { contents: [], updated: true, contentsLength: 0 } })

const setContents = (modelId, contents) =>
  ActorModel.findByIdAndUpdate(modelId, { $set: { contents } });

const updateContent = (modelId, contentId, params) =>
  ActorModel.findOneAndUpdate({ _id: modelId, 'contents._id': contentId }, { $set: { 'contents.$': params }, updated: true })

const syncContents = (modelId) =>
  ActorModel.findByIdAndUpdate(modelId, { $set: { updated: false } })

const syncBulkContents = (modelIds) =>
  ActorModel.updateMany({ _id: { $in: modelIds } }, { $set: { updated: false } })

const updateContentsPlatform = (modelId, contentIds, { platforms, story, knkyStoryType, knkyStoryPrice, f2fStoryType }) =>
  ActorModel.updateOne(
    { _id: modelId },
    {
      $set: {
        'contents.$[elem].platforms': platforms,
        'contents.$[elem].story': story,
        'contents.$[elem].knkyStoryType': knkyStoryType,
        'contents.$[elem].knkyStoryPrice': knkyStoryPrice,
        'contents.$[elem].f2fStoryType': f2fStoryType,
        updated: true,
      }
    },
    { arrayFilters: [{ 'elem._id': { $in: contentIds } }] }
  );

const appendAccount = (modelId, accountId) =>
  ActorModel.findByIdAndUpdate(modelId, { $push: { accounts: accountId }, $set: { updated: true } });

const removeAccount = (modelId, accountId) =>
  ActorModel.findByIdAndUpdate(modelId, { $pull: { accounts: accountId } });

const loadAgencyModelList = (agencyId) =>
  ActorModel.find({ owner: agencyId, deleted: false }, "number name")
    .sort({ number: 1 })
    .populate("accounts", "platform alias");

const loadModelList = () =>
  ActorModel.find({ deleted: false }, "owner number name")
    .sort({ owner: 1, number: 1 })
    .populate("accounts", "platform alias");

const getCountStats = async (agencyId) => {
  const result = await ActorModel.aggregate([
    {
      $match: agencyId ? { owner: agencyId, deleted: false } : { deleted: false }
    },
    {
      $facet: {
        totalCount: [{ $count: "count" }],
        updatedCount: [{ $match: { updated: true } }, { $count: "count" }]
      }
    }
  ]);
  return {
    totalModels: result[0].totalCount[0]?.count || 0,
    updatedModels: result[0].updatedCount[0]?.count || 0,
  }
}

const importContents = (modelId, contents) => {
  return ActorModel.findByIdAndUpdate(modelId, {
    $push: { contents: { $each: contents.map(({ _id, media, ...params }) => ({ ...params, media: [media] })) } },
    $inc: { contentsLength: contents.length },
    $set: { updated: true },
  })
}

const ModelService2 = {
  findAgencyModels,
  loadAgencyModels,
  getAgencyModelCount,
  getCountStatsByAgency,
  loadModels,
  findModelByName,
  findModelByNumber,
  findModelById,
  deleteModel,
  deleteModels,
  findEmptyModels,
  changeModel,
  changeOwner,
  findModelsByIds,
  createModel,
  getModel,

  appendContent,
  deleteContent,
  deleteContents,
  updateContent,
  clearContents,
  setContents,
  syncContents,
  syncBulkContents,
  updateContentsPlatform,
  getModelWithContents,
  appendAccount,
  removeAccount,
  importContents,

  loadAgencyModelList,
  loadModelList,

  getCountStats,
};

module.exports = ModelService2;