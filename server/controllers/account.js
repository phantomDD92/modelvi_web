const { param } = require("../api");
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
    if (!currActor) throw new ApiError(`model is not existed.`);
    const account = await AccountService.createAccount(platform, currActor, params);
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
    if (!account) throw new ApiError("account is not existed.");
    await ActorService.removeAccount(account.actor, id)
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
    const currActor = await AccountService.findById(actor);
    if (!currActor) throw new ApiError("model is not existed.");
    const account = await AccountService.findById(id);
    if (!account) throw new ApiError("account is not existed.");
    await AccountService.updateAccount(id, currActor, params);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleUpdateStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
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
    await AccountService.updateParams(id, params);
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
    await HistoryService.clearHistory(id)
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleClearError = async (req, res) => {
  try {
    const { id } = req.params;
    await AccountService.clearError(id)
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleAllStart = async (req, res) => {
  try {
    const { platform } = req.params;
    await AccountService.setAllStatus(platform, true)
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleAllStop = async (req, res) => {
  try {
    const { platform } = req.params;
    await AccountService.setAllStatus(platform, false)
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
