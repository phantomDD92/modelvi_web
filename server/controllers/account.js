const { Platform, AdminRole } = require("../config/const");
const AccountService = require("../services/account");
const ActorService = require("../services/actor");
const HistoryService = require("../services/history");
const { sendResult, sendError, ApiError } = require("../utils/resp");

const handleLoadAccounts = async (req, res) => {
  try {
    const { platform } = req.params;
    const { page, pageSize } = req.query;
    const [accounts, accountsCount] = await AccountService.loadAccounts(platform, { page, pageSize: pageSize || "10" });
    sendResult(res, { accounts, accountsCount });
  } catch (error) {
    console.error(error);
    sendError(res, error);
  }
};

const handleCreateAccount = async (req, res) => {
  try {
    const { platform } = req.params;
    const { actor, ...params } = req.body;
    let currActor = await ActorService.findById(actor);
    if (!currActor)
      throw new ApiError(`The model is not existed.`);
    if (req.manager.role != AdminRole.MANAGER && currActor.owner.toString() !== req.manager._id.toString())
      throw new ApiError(`The account is able to create only by owner`);
    const count = await AccountService.getAgencyCount(req.manager._id)
    if (req.manager.role == AdminRole.AGENCY && count >= req.manager.maxAccounts)
      throw new ApiError(`Account amount is limited by website`);
    const account = await AccountService.createAccount(platform, currActor, { ...params, owner: currActor.owner, creator: req.manager._id });
    await ActorService.appendAccount(actor, account._id)
    sendResult(res);
  } catch (error) {
    console.error(error);
    sendError(res, error);
  }
};

const handleDeleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await AccountService.findById(id);
    if (!account) throw new ApiError("The account is not existed.");
    if (req.manager.role != AdminRole.MANAGER && account.owner.toString() !== req.manager._id.toString())
      throw new ApiError(`The model is able to delete only by owner.`)
    await ActorService.removeAccount(account.actor, account);
    await AccountService.deleteAccount(id);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleUpdateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { actor, ...params } = req.body;
    const currActor = await ActorService.findById(actor);
    if (!currActor) throw new ApiError("The model is not existed.");
    const account = await AccountService.findById(id);
    if (!account)
      throw new ApiError("The account is not existed.");
    if (req.manager.role != AdminRole.MANAGER && account.owner.toString() !== req.manager._id.toString())
      throw new ApiError(`The model is able to update only by owner.`)
    await AccountService.updateAccount(id, currActor, params);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleUpdateStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const account = await AccountService.findById(id)
    if (!account)
      throw new ApiError("The account is not existed.");
    if (req.manager.role != AdminRole.MANAGER && account.owner.toString() !== req.manager._id.toString())
      throw new ApiError(`The model is able to update only by owner.`)
    await AccountService.setStatus(id, status);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleUpdateParams = async (req, res) => {
  try {
    const { id } = req.params;
    const params = req.body;
    const account = await AccountService.findById(id);
    if (!account)
      throw new ApiError("The account is not existed.");
    if (req.manager.role != AdminRole.MANAGER && account.owner.toString() !== req.manager._id.toString())
      throw new ApiError(`The model is able to update only by owner.`)
    if (account.platform == Platform.F2F) {
      const { commentInterval, notifyInterval, postOffsets, debug } = params;
      await AccountService.updateParams(id, {
        "params.debug": debug,
        "params.commentInterval": commentInterval,
        "params.notifyInterval": notifyInterval,
        "params.postOffsets": postOffsets,
      });
    } else if (account.platform == Platform.FNC) {
      const { commentInterval, notifyInterval, postOffsets, debug } = params;
      await AccountService.updateParams(id, {
        "params.debug": debug,
        "params.commentInterval": commentInterval,
        "params.notifyInterval": notifyInterval,
        "params.postOffsets": postOffsets,
      });
    }
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleLoadHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { page, pageSize } = req.query;
    const [history, historyCount] = await HistoryService.loadHistories(id, { page, pageSize: pageSize || "10" })
    sendResult(res, { history, historyCount });
  } catch (error) {
    sendError(res, error);
  }
};

const handleClearHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await AccountService.findById(id);
    if (!account)
      throw new ApiError("The account is not existed.");
    if (req.manager.role != AdminRole.MANAGER && account.owner.toString() !== req.manager._id.toString())
      throw new ApiError(`The model is able to update only by owner.`)
    await HistoryService.clearHistory(id)
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleClearError = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await AccountService.findById(id);
    if (!account)
      throw new ApiError("The account is not existed.");
    if (req.manager.role != AdminRole.MANAGER && account.owner.toString() !== req.manager._id.toString())
      throw new ApiError(`The model is able to update only by owner.`)
    await AccountService.clearError(id)
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleAllStart = async (req, res) => {
  try {
    const { platform } = req.params;
    if (req.manager.role == AdminRole.MANAGER)
      await AccountService.setAllStatus(platform, true)
    else 
      await AccountService.setAgencyStatus(req.manager, platform, true)
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleAllStop = async (req, res) => {
  try {
    const { platform } = req.params;
    if (req.manager.role == AdminRole.MANAGER)
      await AccountService.setAllStatus(platform, false)
    else 
      await AccountService.setAgencyStatus(req.manager, platform, false)
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const AccountCtrl = {
  handleLoadAccounts,
  handleCreateAccount,
  handleDeleteAccount,
  handleUpdateAccount,
  handleUpdateStatus,
  handleUpdateParams,
  handleLoadHistory,
  handleClearHistory,
  handleClearError,
  handleAllStart,
  handleAllStop,
};

module.exports = AccountCtrl;
