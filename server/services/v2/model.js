const ActorModel = require("../../models/actor");

const findAgencyModels = (agencyId) =>
  ActorModel.find({ owner: agencyId });

const getAgencyModelCount = (agencyId) =>
  ActorModel.countDocuments({ owner: agencyId });

const ModelService2 = {
  findAgencyModels,
  getAgencyModelCount,
};

module.exports = ModelService2;