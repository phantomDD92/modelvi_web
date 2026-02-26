const { TransactionType, PricePlanMode } = require("../../config/const");
const AccountService2 = require("../../services/v2/account");
const AgencyService2 = require("../../services/v2/agency");
const BlockUserService2 = require("../../services/v2/blockUser");
const CommentService2 = require("../../services/v2/comment");
const ModelService2 = require("../../services/v2/model");
const TransactionService2 = require("../../services/v2/transaction");
const { DEFAULT_PROXY_FEE } = require("../../utils/const");
const { getAccountFee, getModelFee } = require("../../utils/helper");
const NotifyUtils = require("../../utils/notifiy");
const { sendError, sendResult, ApiError } = require("../../utils/resp");

const calculateAgencyFee = async (agency) => {
  const pricePlanMode = agency.pricePlanMode || PricePlanMode.PER_MODEL;
  let fee = 0;
  if (pricePlanMode == PricePlanMode.PER_ACCOUNT) {
    const accounts = await AccountService2.getAgencyPayableAccounts(agency._id);
    for (var account of accounts) {
      const accountFee = getAccountFee(agency, account.platform, account.revenue);
      // console.log(`[${account.platform}] ${account.alias} : ${account.revenue} => ${accountFee}`);
      fee += accountFee
    }
    // console.log(`##### [PER_ACCOUNT] ${agency.name} => ${fee}`);
  } else {
    const models = await AccountService2.getAgencyPayableModels(agency._id);
    for (var model of models) {
      const modelFee = getModelFee(agency, model.revenue, model.accounts);
      // console.log(`[${model.model} (${(model.accounts || []).length} accounts)]: ${model.revenue} => ${modelFee}`);
      fee += modelFee
    }
    // console.log(`##### [PER_MODEL] ${agency.name} => ${fee}`);
  }
  return fee;
}

const updateAgencyFee = async (agencyId) => {
  try {
    const agency = await AgencyService2.findAgencyById(agencyId);
    const fee = await calculateAgencyFee(agency);
    await AgencyService2.updateFee(agencyId, fee);
  } catch (error) {

  }
}

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
        if (balance > 0) {
          await TransactionService2.createChargeTransaction(agencyId, TransactionType.CHARGE_INVOICE, balance, from, to, "Modelvi payment");
          NotifyUtils.sendPaymentMessage(agency, "Payment By Manager",
            `Manager:${req.manager?.name}\nCharge: $${balance}\nBalance:$${from} => $${to}`
          )
        } else {
          NotifyUtils.sendPaymentMessage(agency, "Payment By Manager",
            `Manager:${req.manager?.name}\nDecharge: $${balance}\nBalance:$${from} => $${to}`
          )
        }

        break;
      case "status":
        const { status } = params;
        await AgencyService2.changeStatus(agencyId, status);
        break;
      case "mode":
        const { mode } = params;
        await AgencyService2.changePricePlanMode(agencyId, mode);
        await updateAgencyFee(agencyId);
        break;
      case "plan":
        const { pricePlans } = params;
        await AgencyService2.changePricePlans(agencyId, pricePlans);
        await updateAgencyFee(agencyId);
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
    const agencyInfos = agencies.map(agency => {
      const modelStat = modelStats.find(stat => stat._id.toString() == agency._id.toString());
      const accountStat = accountStats.filter(stat => stat._id?.creator?.toString() == agency._id.toString());
      return ({
        ...agency.toJSON(),
        accountCount: accountStat.map(item => `${item.platform} ${item.count}`).join(', '),
        modelCount: modelStat?.count || 0,
        proxyFee: accountStat.reduce((sum, item) => sum += item.count, 0) * DEFAULT_PROXY_FEE,
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

const handleGetAgencyInfoForAdmin = async (req, res) => {
  try {
    const { agencyId } = req.params;
    const { action, ...params } = req.body;
    let payload;
    switch (action) {
      case 'comments':
        const comments = await CommentService2.loadAgencyComments(agencyId);
        payload = { comments };
        break;
      case 'users':
        const users = await BlockUserService2.loadAgencyBlockUsers(agencyId);
        payload = { users };
        break;
      default:
        throw new ApiError("Invalid agency admin operation");
    }
    sendResult(res, payload);
  } catch (error) {
    console.error(error)
    sendError(res, error);
  }
}


const AgencyCtrl2 = {
  handleUpdateAgencyForAdmin,
  handleLoadAgenciesForAdmin,
  handleDeleteAgencyForAdmin,
  handleDeleteAgenciesForAdmin,
  handleUpdateAgenciesForAdmin,
  handleLoadAgencyListForAdmin,
  handleGetAgencyInfoForAdmin,
}

module.exports = AgencyCtrl2;