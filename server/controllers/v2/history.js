const AccountService2 = require("../../services/v2/account");
const HistoryService2 = require("../../services/v2/history");
const { isModelOwner } = require("../../utils/helper");
const { sendError, sendResult } = require("../../utils/resp");

const handleLoadHistoryForAgency = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { page, pageSize } = req.query;
    const account = await AccountService2.findAccountById(accountId);
    if (!account)
      throw new ApiError("Account does not exist");
    if (!isModelOwner(account, req.manager))
      throw new ApiError("Account can be accessible by owner");
    const [history, historyCount] = await HistoryService2.loadHistories(accountId, { page, pageSize: pageSize || "20" })
    sendResult(res, { history, historyCount, account });
  } catch (error) {
    sendError(res, error);
  }
};

const handleLoadHistoryForAdmin = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { page, pageSize } = req.query;
    const account = await AccountService2.findAccountById(accountId);
    if (!account)
      throw new ApiError("Account does not exist");
    const [history, historyCount] = await HistoryService2.loadHistories(accountId, { page, pageSize: pageSize || "20" })
    sendResult(res, { history, historyCount, account });
  } catch (error) {
    sendError(res, error);
  }
};

const handleClearHistoryForAgency = async (req, res) => {
  try {
    const { accountId } = req.params;
    const account = await AccountService2.findAccountById(accountId);
    if (!account)
      throw new ApiError("The account does not exist.");
    if (!isModelOwner(account, req.manager))
      throw new ApiError("Account can be accessible by owner");
    await HistoryService2.clearHistory(accountId)
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleClearHistoryForAdmin = async (req, res) => {
  try {
    const { accountId } = req.params;
    const account = await AccountService2.findAccountById(accountId);
    if (!account)
      throw new ApiError("The account does not exist.");
    await HistoryService2.clearHistory(accountId)
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleClearErrorForAgency = async (req, res) => {
  try {
    const { accountId } = req.params;
    const account = await AccountService2.findAccountById(accountId);
    if (!account)
      throw new ApiError("The account does not exist.");
    if (!isModelOwner(account, req.manager))
      throw new ApiError("Account can be accessible by owner");
    await AccountService2.clearError(accountId)
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleClearErrorForAdmin = async (req, res) => {
  try {
    const { accountId } = req.params;
    const account = await AccountService2.findAccountById(accountId);
    if (!account)
      throw new ApiError("The account does not exist.");
    await AccountService2.clearError(accountId)
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const HistoryCtrl2 = {
  handleLoadHistoryForAdmin,
  handleClearErrorForAdmin,
  handleClearHistoryForAdmin,
  handleLoadHistoryForAgency,
  handleClearErrorForAgency,
  handleClearHistoryForAgency
}

module.exports = HistoryCtrl2