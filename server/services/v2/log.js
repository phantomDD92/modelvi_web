const LogModel = require("../../models/log");

const createLog = (account, success, action, log, extra) =>
    LogModel.create({
        account: account._id,
        model: account.actor._id || account.actor,
        agency: account.owner_id || account.owner,
        success,
        log,
        extra
    });

const LogService2 = {
    createLog
};

module.exports = LogService2