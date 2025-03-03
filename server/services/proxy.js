const { default: mongoose } = require("mongoose");
const { Status, AdminRole } = require("../config/const")
const Proxy = require("../models/proxy")

const loadProxies = (agency) =>
    Proxy.find(agency.role == AdminRole.MANAGER ? {} : { owner: agency._id })
        .populate('owner', 'name');

const loadProxiesForOwner = (owner) =>
    Proxy.find({ owner })

const clearProxies = (agency) =>
    Proxy.deleteMany({ owner: agency._id })

const changeProxyStatus = (proxyId, status) =>
    Proxy.findByIdAndUpdate(proxyId, { $set: { status } })

const getProxyStats = (agency) => {
    return Promise.all([
        Proxy.count(agency.role == AdminRole.MANAGER ? {} : { owner: agency._id }),
        Proxy.count(agency.role == AdminRole.MANAGER ? { status: Status.ACTIVE } : { owner: agency._id, status: Status.ACTIVE })
    ]);
}

const appendProxies = (agency, proxies, deadline) => {
    let ops = []
    for (proxy of proxies) {
        ops.push({
            insertOne: {
                document: {
                    url: proxy,
                    owner: agency._id,
                    protocol: 'http',
                    status: true,
                    expiredAt: deadline,
                }
            }
        });
    }
    return Proxy.bulkWrite(ops);
}

const deleteProxy = (proxyId) =>
    Proxy.findByIdAndDelete(proxyId)

const getCount = (agency) =>
    Promise.all([
        Proxy.countDocuments(agency.role == AdminRole.MANAGER ? {} : { owner: agency._id }),
        Proxy.countDocuments(agency.role == AdminRole.MANAGER ? { expiredAt: { $lt: new Date() } } : { owner: agency._id, expiredAt: { $lt: new Date() } })
    ]);

const findProxyById = (proxyId) =>
    Proxy.findById(proxyId)

const findProxyByAccount = (agencyId, platform, alias = undefined) => {
    const field = `usage.${platform}`;
    return Proxy.findOne({ [field]: alias, owner: agencyId });
}

const setProxyAccount = (proxyId, platform, alias) => {
    const field = `usage.${platform}`;
    return Proxy.findByIdAndUpdate(proxyId, { $set: { [field]: alias } });
}

const changeBulkProxiesStatus = (agency, proxyIds, status) =>
    agency.role == AdminRole.MANAGER
        ? Proxy.updateMany({ _id: { $in: proxyIds } }, { $set: { status } })
        : Proxy.updateMany({ _id: { $in: proxyIds }, owner: agency._id }, { $set: { status } });

const deleteBulkProxies = (agency, proxyIds) =>
    agency.role == AdminRole.MANAGER
        ? Proxy.deleteMany({ _id: { $in: proxyIds } })
        : Proxy.deleteMany({ _id: { $in: proxyIds }, owner: agency._id });

const ProxyService = {
    findProxyById,
    loadProxies,
    loadProxiesForOwner,
    appendProxies,
    clearProxies,
    changeProxyStatus,
    changeBulkProxiesStatus,
    deleteProxy,
    deleteBulkProxies,
    findProxyByAccount,
    setProxyAccount,

    getProxyStats,
    getCount,
}

module.exports = ProxyService