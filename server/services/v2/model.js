const ActorModel = require("../../models/actor");

const findAgencyModels = (agencyId) =>
  ActorModel.find({ owner: agencyId });

const getAgencyModelCount = (agencyId) =>
  ActorModel.countDocuments({ owner: agencyId });

const getCountStatsByAgency = () =>
  ActorModel.aggregate([
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

const ModelService2 = {
  findAgencyModels,
  getAgencyModelCount,
  getCountStatsByAgency
};

module.exports = ModelService2;