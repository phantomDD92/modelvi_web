const HistoryModel = require("../models/history")

const loadHistories = (accountId, { page, pageSize }) =>
    Promise.all([
        HistoryModel
        .find({ account: accountId })
        .sort("-createdAt")
        .skip((parseInt(page) - 1) * parseInt(pageSize))
        .limit(parseInt(pageSize))
        .populate({
            path: "account",
            select: "actor number alias",
            populate: {
                path: "actor",
                select: "name"
            }
        }),
        HistoryModel.countDocuments({ account: accountId })
    ])


const clearHistory = (accountId) =>
    HistoryModel.deleteMany({ account: accountId })

const createHistory = (accountId, action) =>
    HistoryModel.create({account: accountId, action})

const HistoryService = {
    loadHistories,
    clearHistory,
    createHistory,
}

module.exports = HistoryService