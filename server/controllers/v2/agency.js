const { TransactionType } = require("../../config/const");
const AccountService2 = require("../../services/v2/account");
const AgencyService2 = require("../../services/v2/agency");
const ModelService2 = require("../../services/v2/model");
const TransactionService2 = require("../../services/v2/transaction");
const NotifyUtils = require("../../utils/notifiy");
const { sendError, sendResult, ApiError } = require("../../utils/resp");

const handleUpdateAgencyForAdmin = async (req, res) => {
  try {
    const { agencyId } = req.params;
    const { action, ...params } = req.body;
    switch (action) {
      case 'balance':
        const { balance } = params;
        const agency = await AgencyService2.updateBalance(agencyId, balance);
        const from = agency.balance || 0;
        const to = from + balance;
        await TransactionService2.createChargeTransaction(agencyId, TransactionType.CHARGE_INVOICE, balance, from, to, "Modelvi payment");
        NotifyUtils.sendPaymentMessage(agency, "Payment By Manager",
          `Manager:${req.manager?.name}\nCharge: $${balance}\nBalance:$${from} => $${to}`
        )
        break;
      case "status":
        const { status } = params;
        await AgencyService2.changeStatus(agencyId, status);
        break;
      case "plan":
        const { pricePlans } = params;
        await AgencyService2.changePricePlans(agencyId, pricePlans);
        break;
      case "referrer":
        const { referrer } = params;
        await AgencyService2.changeReferrer(agencyId, referrer);
        break;
      case "commission":
        const { commission } = params;
        await AgencyService2.changeCommission(agencyId, commission);
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


const handleLoadAgenciesForAdmin = async (req, res) => {
  try {
    const agencies = await AgencyService2.loadAgencies();
    const modelStats = await ModelService2.getCountStatsByAgency();
    const accountStats = await AccountService2.getCountStatsByAgencyPlatform();
    const feeStats = await AccountService2.getFeeStatsByAgency();
    const agencyInfos = agencies.map(agency => {
      const modelStat = modelStats.find(stat => stat._id.toString() == agency._id.toString());
      const accountStat = accountStats.filter(stat => stat._id?.creator?.toString() == agency._id.toString());
      const feeStat = feeStats.find(stat => stat._id.toString() == agency._id.toString());
      return ({
        ...agency.toJSON(),
        modelCount: modelStat?.count || 0,
        monthlyFee: feeStat?.monthlyFee || 0,
        accountCount: accountStat.map(item => `${item.platform} ${item.count}`).join(', ')
      })
    });

    sendResult(res, { agencies: agencyInfos })
  } catch (error) {
    sendError(res, error)
  }
}

const handleDeleteAgencyForAdmin = async (req, res) => {
  try {
    const { agencyId } = req.params;
    const agency = await AgencyService2.findAgencyById(agencyId);
    if (!agency)
      throw new ApiError("Agency does not exist");
    await AgencyService2.deleteAgency(agencyId);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
}

const handleDeleteAgenciesForAdmin = async (req, res) => {
  try {
    const { agencyIds } = req.body;
    await AgencyService2.deleteAgencies(agencyIds);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
}

const handleUpdateAgenciesForAdmin = async (req, res) => {
  try {
    const { action, agencyIds, ...params } = req.body;
    switch (action) {
      case 'status':
        const { status } = params;
        await AgencyService2.changeStatuses(agencyIds, status);
        break;
      default:
        throw new ApiError("Invalid agency admin operation");
    }
    sendResult(res);
  } catch (error) {
    console.error(error)
    sendError(res, error);
  }
}

const handleLoadAgencyListForAdmin = async (req, res) => {
  try {
    const agencyList = await AgencyService2.getAgencyList();
    sendResult(res, { agencyList });
  } catch (error) {
    sendError(res, error);
  }
}


const AgencyCtrl2 = {
  handleUpdateAgencyForAdmin,
  handleLoadAgenciesForAdmin,
  handleDeleteAgencyForAdmin,
  handleDeleteAgenciesForAdmin,
  handleUpdateAgenciesForAdmin,
  handleLoadAgencyListForAdmin
}

module.exports = AgencyCtrl2;