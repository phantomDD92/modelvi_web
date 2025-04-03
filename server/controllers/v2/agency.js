const AgencyService2 = require("../../services/v2/agency");
const TransactionService2 = require("../../services/v2/transaction");
const { getPricePlan } = require("../../utils/helper");
const { sendError, sendResult, ApiError } = require("../../utils/resp");

const handleUpdateAgencyForAdmin = async (req, res) => {
  try {
    const { id: agencyId } = req.params;
    const { action, ...params } = req.body;
    switch (action) {
      case 'balance':
        const { balance } = params;
        const agency = await AgencyService2.updateBalance(agencyId, balance);
        const from = agency.balance || 0;
        const to = from + balance;
        await TransactionService2.createTransaction(agencyId, balance, from, to, "Modelvi payment");
        break;
      case 'vip':
        const { vip } = params;
        await AgencyService2.updateVip(agencyId, vip);
        break;
      default:
        throw new ApiError("Invalid agency action");
    }
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
}

const AgencyCtrl2 = {
  handleUpdateAgencyForAdmin,
}

module.exports = AgencyCtrl2;