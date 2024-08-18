const { Status } = require("../config/const")
const ProxyModel = require("../models/proxy")
const Proxy = require("../models/proxy")

const loadProxies = ({ page, pageSize }) =>
    Promise.all([
        Proxy.find({})
            .skip((parseInt(page) - 1) * parseInt(pageSize))
            .limit(parseInt(pageSize)),
        ProxyModel.countDocuments()
    ])


const clearProxies = () => {
    return Proxy.deleteMany({})
}

const setProxyStatus = (id, status) => {
    return Proxy.findByIdAndUpdate(id, { $set: { status } })
}

const getProxyStats = () => {
    return Promise.all([
        ProxyModel.count({}),
        ProxyModel.count({ status: Status.ACTIVE })
    ]);
}

const addProxies = (proxies, deadline) => {
    let ops = []
    for (proxy of proxies) {
        ops.push({
            insertOne: {
                document: {
                    url: proxy,
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

const getCount = () => ProxyModel.countDocuments()

const ProxyService = {
    loadProxies,
    clearProxies,
    addProxies,
    getProxyStats,
    setProxyStatus,
    deleteProxy,
    getCount,
}
module.exports = ProxyService