const { Status, AdminRole } = require("../config/const")
const ProxyModel = require("../models/proxy")
const Proxy = require("../models/proxy")

const loadProxies = (agency, { page, pageSize }) =>
    Promise.all([
        Proxy.find(agency.role == AdminRole.MANAGER ? {} : { owner: agency._id })
            .skip((parseInt(page) - 1) * parseInt(pageSize))
            .limit(parseInt(pageSize))
            .populate('owner', 'name'),
        ProxyModel.countDocuments(agency.role == AdminRole.MANAGER ? {} : { owner: agency._id })
    ])


const clearProxies = (agency) => {
    return Proxy.deleteMany({ owner: agency._id })
}

const setProxyStatus = (id, status) => {
    return Proxy.findByIdAndUpdate(id, { $set: { status } })
}

const getProxyStats = (agency) => {
    return Promise.all([
        ProxyModel.count(agency.role == AdminRole.MANAGER ? {} : { owner: agency._id }),
        ProxyModel.count(agency.role == AdminRole.MANAGER ? { status: Status.ACTIVE } : { owner: agency._id, status: Status.ACTIVE })
    ]);
}

const addProxies = (agency, proxies, deadline) => {
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

const deleteProxy = (id) => {
    return ProxyModel.deleteOne({ _id: id })
}

const getCount = (agency) => ProxyModel.countDocuments(agency.role == AdminRole.MANAGER ? {} : { owner: agency._id })

const findById = (id) =>
    ProxyModel.findById(id)

const ProxyService = {
    loadProxies,
    clearProxies,
    addProxies,
    getProxyStats,
    setProxyStatus,
    deleteProxy,
    getCount,
    findById
}
module.exports = ProxyService