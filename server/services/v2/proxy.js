const ProxyModel = require("../../models/proxy")

const findAgencyProxies = (agencyId) =>
  ProxyModel.find({ owner: agencyId });

const getAgencyProxyCount = (agencyId) =>
  ProxyModel.countDocuments({ owner: agencyId });

const ProxyService2 = {
  findAgencyProxies,
  getAgencyProxyCount,
}

module.exports = ProxyService2