const moment = require('moment');
const RevenueHistoryModel = require("../../models/revenuehistory");

const createHistory = (account, revenue, fee) => {
  const time = moment().format("YYYY-MM-DD");
  return RevenueHistoryModel.findOneAndUpdate(
    { account: account._id, time },
    {
      $set: {
        agency: account.owner,
        model: account.actor?._id || account.actor,
        account: account._id,
        platform: account.platform,
        time,
        revenue,
        fee,
      }
    },
    { new: true, upsert: true },
  );
}


const RevenueHistoryService = {
  createHistory,
};

module.exports = RevenueHistoryService;