const { Platform, AdminRole, PostMode } = require("../config/const");
const AccountService = require("../services/account");
const ActorService = require("../services/actor");
const ChatTeamService = require("../services/chatteam");
const HistoryService = require("../services/history");
const NotifyUtils = require("../utils/notifiy");
const { sendResult, sendError, ApiError } = require("../utils/resp");

const handleLoadAccounts = async (req, res) => {
  try {
    const { platform } = req.params;
    const accounts = await AccountService.loadAccounts(req.manager, platform);
    sendResult(res, { accounts });
  } catch (error) {
    console.error(error);
    sendError(res, error);
  }
};

const handleCreateAccount = async (req, res) => {
  try {
    const { platform } = req.params;
    const { actor, chatTeam, ...params } = req.body;
    let currActor = await ActorService.findById(actor);
    if (!currActor)
      throw new ApiError(`Model does not exist.`);
    // check duplication
    const { alias } = params;
    const dupAccount = await AccountService.findByAlias(platform, alias);
    if (dupAccount)
      throw new ApiError("Account with the same alias is already existed.");
    if (req.manager.role != AdminRole.MANAGER && currActor.owner.toString() !== req.manager._id.toString())
      throw new ApiError(`Account is able to create only by owner`);
    const count = await AccountService.getAgencyCount(req.manager._id)
    if (req.manager.role == AdminRole.AGENCY && count >= req.manager.maxAccounts)
      throw new ApiError(`Account amount is limited by website`);
    const account = await AccountService.createAccount(platform, currActor, { ...params, chatTeam, owner: currActor.owner, creator: req.manager._id });
    await ActorService.appendAccount(actor, account._id)
    if (chatTeam)
      await ChatTeamService.appendTeamAccount(chatTeam, account._id);
    await NotifyUtils.sendMessage(
      `${req.manager.name} (${req.manager.role == AdminRole.MANAGER ? "Admin" : "Agency"})`,
      `${currActor.number}. ${currActor.name} - ${platform} ${alias}`,
      `CREATE A ACCOUNT`);
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
    if (!account) throw new ApiError("Account does not exist.");
    if (req.manager.role != AdminRole.MANAGER && account.owner.toString() !== req.manager._id.toString())
      throw new ApiError(`Account is able to delete only by owner.`)
    await ActorService.removeAccount(account.actor?._id, account);
    if (account.chatTeam)
      await ChatTeamService.removeTeamAccount(account.chatTeam, account._id)
    await AccountService.deleteAccount(id);
    await NotifyUtils.sendMessage(
      `${req.manager.name} (${req.manager.role == AdminRole.MANAGER ? "Admin" : "Agency"})`,
      `${account.actor?.number}. ${account.actor?.name} - ${account.platform} ${account.alias}`,
      `DELETE A ACCOUNT`);
    sendResult(res);
  } catch (error) {
    sendError(res, error)
  }
};

const handleUpdateAccount = async (req, res) => {
  try {
    const { id: accountId } = req.params;
    const { action, ...params } = req.body;
    const account = await AccountService.findById(accountId);
    if (!account)
      throw new ApiError("Account does not exist.");
    if (req.manager.role != AdminRole.MANAGER && account.owner.toString() !== req.manager._id.toString())
      throw new ApiError(`The model is able to update only by owner.`)
    switch (action) {
      case "change":
        const { actor, chatTeam, ...others } = params;
        const currActor = await ActorService.findById(actor);
        if (!currActor)
          throw new ApiError("Model does not exist.");
        await AccountService.updateAccount(accountId, currActor, { chatTeam, ...others });
        if (account.chatTeam)
          await ChatTeamService.removeTeamAccount(account.chatTeam, account._id)
        if (chatTeam)
          await ChatTeamService.appendTeamAccount(chatTeam, account._id)
        break;
      case "status":
        const { status } = params;
        await AccountService.setStatus(accountId, status);
        await NotifyUtils.sendMessage(
          `${req.manager.name} (${req.manager.role == AdminRole.MANAGER ? "Admin" : "Agency"})`,
          `${account.actor?.number}. ${account.actor?.name} - ${account.platform} ${account.alias}`,
          `${status ? 'ENABLE' : 'DISABLE'} A BOT`);
        break;
      case "setting":
        await AccountService.updateParams(id, { params: { ...account.params, ...params } });
        break;
      default:
        throw new ApiError("Invalid account operation");
    }
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleUpdateAccounts = async (req, res) => {
  try {
    const { platform } = req.params;
    const { action, accountIds, status, ...params } = req.body;
    switch (action) {
      case "status":
        const accounts = await AccountService.getBulkAccounts(req.manager, accountIds);
        await AccountService.updateBulkAccountsStatus(req.manager, accountIds, status);
        await NotifyUtils.sendMessage(
          `${req.manager.name} (${req.manager.role == AdminRole.MANAGER ? "Admin" : "Agency"})`,
          `${accounts.map(account => `${account.actor?.number}. ${account.actor?.name} - ${account.platform} ${account.alias}`).join(", ")}`,
          `${status ? 'ENABLE' : 'DISABLE'} ${accounts.length} BOTS`);
        break;
      case "all":
        await AccountService.setAllStatus(req.manager, platform, status);
        await NotifyUtils.sendMessage(
          `${req.manager.name} (${req.manager.role == AdminRole.MANAGER ? "Admin" : "Agency"})`,
          `ALL ACCOUNTS`,
          `${status ? 'ENABLE' : 'DISABLE'} ALL BOTS`);
        break;
      default:
        throw new ApiError("Invalid account operation");
    }
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleDeleteAccounts = async (req, res) => {
  try {
    const { accountIds } = req.body;
    const accounts = await AccountService.getBulkAccounts(req.manager, accountIds);
    for (account of accounts) {
      await ActorService.removeAccount(account.actor?._id, account);
      if (account.chatTeam)
        await ChatTeamService.removeTeamAccount(account.chatTeam, account._id)
    }
    await AccountService.deleteBulkAccounts(req.manager, accountIds);
    await NotifyUtils.sendMessage(
      `${req.manager.name} (${req.manager.role == AdminRole.MANAGER ? "Admin" : "Agency"})`,
      `${accounts.map(account => `${account.actor?.number}. ${account.actor?.name} - ${account.platform} ${account.alias}`).join(", ")}`,
      `DELETE ${accounts.length} ACCOUNTS`);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleLoadHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { page, pageSize } = req.query;
    const account = await AccountService.findById(id);
    const [history, historyCount] = await HistoryService.loadHistories(id, { page, pageSize: pageSize || "10" })
    sendResult(res, { history, historyCount, account });
  } catch (error) {
    sendError(res, error);
  }
};

const handleClearHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await AccountService.findById(id);
    if (!account)
      throw new ApiError("The account does not exist.");
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
      throw new ApiError("The account does not exist.");
    if (req.manager.role != AdminRole.MANAGER && account.owner.toString() !== req.manager._id.toString())
      throw new ApiError(`The model is able to update only by owner.`)
    await AccountService.clearError(id)
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
  handleUpdateAccounts,
  handleDeleteAccounts,
  handleLoadHistory,
  handleClearHistory,
  handleClearError,
};

module.exports = AccountCtrl;
