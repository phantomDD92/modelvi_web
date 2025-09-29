const moment = require('moment');
const LogModel = require("../../models/log");

const createLog = (account, params) =>
    LogModel.create({
        account: account._id,
        model: account.actor._id || account.actor,
        agency: account.owner_id || account.owner,
        ...params
    });

const loadAccountLogs = (accountId, { failedOnly, page, pageSize }) => {
    const resultQuery = failedOnly == "true" ? { success: false } : {}
    const query = {
        account: accountId,
        ...resultQuery,
    }
    console.log(query);
    return Promise.all([
        LogModel
            .find(query, "action success message createdAt")
            .sort("-createdAt")
            .skip((parseInt(page) - 1) * parseInt(pageSize))
            .limit(parseInt(pageSize)),
        LogModel.countDocuments(query)
    ]);
}

const clearAccountLogs = (accountId) =>
    LogModel.deleteMany({ account: accountId, createdAt: { $lte: moment().subtract(7, "day").toDate() } });

const clearLogs = () =>
    HistoryModel.deleteMany({ createdAt: { $lte: moment().subtract(7, "day").toDate() } })

const LogService2 = {
    createLog,
    loadAccountLogs,
    clearAccountLogs,
    clearLogs
};

module.exports = LogService2