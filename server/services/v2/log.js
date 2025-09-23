const LogModel = require("../../models/log");

const createLog = (account, params) =>
    LogModel.create({
        account: account._id,
        model: account.actor._id || account.actor,
        agency: account.owner_id || account.owner,
        ...params
    });

const LogService2 = {
    createLog
};

module.exports = LogService2