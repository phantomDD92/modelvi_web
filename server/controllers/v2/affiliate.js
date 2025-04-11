const AffiliateService2 = require("../../services/v2/affiliate");
const AgencyService2 = require("../../services/v2/agency");
const TransactionService2 = require("../../services/v2/transaction");
const { sendError, sendResult } = require("../../utils/resp");

const handleLoadAffiliatesForAdmin = async (req, res) => {
  try {
    const { time } = req.query;
    const statsByTime = await AffiliateService2.getTotalAffiliateStatsByTime(time);
    const statsByAgency = await AffiliateService2.getTotalAffiliateStatsByAgency();
    const agencies = await AgencyService2.loadAgenciesForAffiliate();
    const transactionStatsByAgency = await TransactionService2.getTotalStatsByAgency();
    const transactionStatsByTime = await TransactionService2.getTotalStatsByTime(time);
    sendResult(res, { statsByTime, statsByAgency, agencies, transactionStatsByAgency, transactionStatsByTime });
  } catch (error) {
    sendError(res, error)
  }
}

const AffiliateCtrl2 = {
  handleLoadAffiliatesForAdmin
};

module.exports = AffiliateCtrl2;