const moment = require("moment");
const HistoryModel = require("../../models/history");

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


const clearAccountHistory = (accountId) =>
  HistoryModel.deleteMany({ account: accountId })

const createHistory = (accountId, action) =>
  HistoryModel.create({ account: accountId, action });

const clearOldHistories = () =>
  HistoryModel.deleteMany({ createdAt: { $lte: moment().subtract(7, "day").toDate() } })

const HistoryService2 = {
  loadHistories,
  clearAccountHistory,
  createHistory,
  clearOldHistories,
}

module.exports = HistoryService2;