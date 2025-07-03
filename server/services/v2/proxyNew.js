const ProxyNewModel = require("../../models/proxyNew");

const clearProxies = () =>
  ProxyNewModel.deleteMany({});

const appendProxies = (proxies) =>
  ProxyNewModel.bulkWrite(proxies.map(proxy => ({
    insertOne: {
      document: {
        url: proxy,
        status: true,
      }
    }
  })));

const deleteProxy = (proxyId) =>
  ProxyNewModel.findByIdAndDelete(proxyId);

const deleteProxies = (proxyIds) =>
  ProxyNewModel.deleteMany({ _id: { $in: proxyIds } })

const loadProxies = () =>
  ProxyNewModel.find({});

const changeStatus = (proxyId, status) =>
  ProxyNewModel.findByIdAndUpdate(proxyId, { $set: { status } })

const pickupProxy = async () => {
  const proxies = await ProxyNewModel.find({});
  if (proxies.length == 0)
    return undefined;
  const proxyIndex = Math.round(Math.random() * (proxies.length - 1))
  return proxies[proxyIndex].url;
}

const ProxyNewService2 = {
  clearProxies,
  deleteProxies,
  deleteProxy,
  appendProxies,
  changeStatus,
  loadProxies,
  pickupProxy,
}

module.exports = ProxyNewService2;