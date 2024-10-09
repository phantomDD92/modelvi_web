const LogModel = require("../models/log")

const createLog = ({ platform, alias, message, level, stack }) =>
    LogModel.create({ platform, alias, message, level, stack })

const LogService = {
    createLog,
}

module.exports = LogService