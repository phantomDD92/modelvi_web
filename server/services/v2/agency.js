const ManagerModel = require("../../models/manager")

const updateBalance = (agencyId, amount) =>
  ManagerModel.findByIdAndUpdate(agencyId, { $inc: { balance: amount } })

const updateVip = (agencyId, vip) =>
  ManagerModel.findByIdAndUpdate(agencyId, { $set: { vip } })

const findAgencyById = (agencyId) => 
  ManagerModel.findById(agencyId);

const AgencyService2 = {
  updateBalance,
  updateVip,
  findAgencyById,
}

module.exports = AgencyService2