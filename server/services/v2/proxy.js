const ProxyModel = require("../../models/proxy")

const getAgencyProxyCount = (agencyId) =>
  ProxyModel.countDocuments({ owner: agencyId });

const loadAgencyProxies = (agencyId) =>
  agencyId == "0"
    ? ProxyModel.find({})
    : ProxyModel.find({ owner: agencyId })

const ProxyService2 = {
  loadAgencyProxies,
  getAgencyProxyCount,
}

module.exports = ProxyService2