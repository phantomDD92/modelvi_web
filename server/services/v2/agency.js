const ManagerModel = require("../../models/manager")

const updateBalance = (agencyId, amount) =>
  ManagerModel.findByIdAndUpdate(agencyId, { $inc: { balance: amount } })

const AgencyService2 = {
  updateBalance,
}

module.exports = AgencyService2