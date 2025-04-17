const { sendResult, sendError } = require("../../utils/resp");

const loadAccountStatsForAdmin = async (req, res) => {
  try {
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
}

const AccountCtrl2 = {
  loadAccountStatsForAdmin,
}

module.exports = AccountCtrl2;