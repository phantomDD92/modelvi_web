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
    const { page, pageSize } = req.query;
    const [accounts, accountsCount] = await AccountService.loadAccounts(req.manager, platform, { page, pageSize: pageSize || "10" });
    sendResult(res, { accounts, accountsCount });
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
      throw new ApiError(`The model does not exist.`);
    // check duplication
    const { alias } = params;
    const dupAccount = await AccountService.findByAlias(platform, alias);
    if (dupAccount)
      throw new ApiError("The account with the same alias is already existed.");
    if (req.manager.role != AdminRole.MANAGER && currActor.owner.toString() !== req.manager._id.toString())
      throw new ApiError(`The account is able to create only by owner`);
    const count = await AccountService.getAgencyCount(req.manager._id)
    if (req.manager.role == AdminRole.AGENCY && count >= req.manager.maxAccounts)
      throw new ApiError(`Account amount is limited by website`);
    const account = await AccountService.createAccount(platform, currActor, { ...params, chatTeam: chatTeam, owner: currActor.owner, creator: req.manager._id });
    await ActorService.appendAccount(actor, account._id)
    await ChatTeamService.appendAccount(chatTeam, account._id);
    await NotifyUtils.sendMessage(`AGENCY : ${req.manager.name})`, `ACCOUNT : ${currActor.number}. ${currActor.name} - ${platform} - ${alias}`, `create account`);
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
    if (!account) throw new ApiError("The account does not exist.");
    if (req.manager.role != AdminRole.MANAGER && account.owner.toString() !== req.manager._id.toString())
      throw new ApiError(`The model is able to delete only by owner.`)
    await ActorService.removeAccount(account.actor?._id, account);
    if (account.chatTeam)
      await ChatTeamService.removeAccount(account.chatTeam, account._id)
    await AccountService.deleteAccount(id);
    await NotifyUtils.sendMessage(`AGENCY : ${req.manager.name}`, `ACCOUNT : ${account.actor?.number}. ${account.actor?.name} - ${account.platform} - ${account.alias}`, `delete account`);
    sendResult(res);
  } catch (error) {
    sendError(res, error)
  }
};

const handleUpdateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { actor, chatTeam, ...params } = req.body;
    const currActor = await ActorService.findById(actor);
    if (!currActor) throw new ApiError("The model does not exist.");
    const account = await AccountService.findById(id);
    if (!account)
      throw new ApiError("The account does not exist.");
    if (req.manager.role != AdminRole.MANAGER && account.owner.toString() !== req.manager._id.toString())
      throw new ApiError(`The model is able to update only by owner.`)
    await AccountService.updateAccount(id, currActor, { chatTeam, ...params });
    if (account.chatTeam)
      await ChatTeamService.removeAccount(account.chatTeam, account._id)
    if (chatTeam)
      await ChatTeamService.appendAccount(chatTeam, account._id)
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
      throw new ApiError("The account does not exist.");
    if (req.manager.role != AdminRole.MANAGER && account.owner.toString() !== req.manager._id.toString())
      throw new ApiError(`The model is able to update only by owner.`)
    await AccountService.setStatus(id, status);
    await NotifyUtils.sendMessage(`AGENCY : ${req.manager.name}`, `ACCOUNT : ${account.actor?.number}. ${account.actor?.name} - ${account.platform} - ${account.alias}`, `${status ? 'enable' : 'disable'} bot`);
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
      throw new ApiError("The account does not exist.");
    if (req.manager.role != AdminRole.MANAGER && account.owner.toString() !== req.manager._id.toString())
      throw new ApiError(`The model is able to update only by owner.`)
    if (account.platform == Platform.F2F) {
      const { commentInterval, postInterval, postCount, postMode, postOffsets, postLimit, postStart, commentEnabled } = params;
      await AccountService.updateParams(id, {
        "params.postInterval": postInterval,
        "params.postCount": postCount,
        "params.postMode": postMode,
        "params.postOffsets": postOffsets,
        "params.postStart": postStart,
        "params.postLimit": postLimit,
        "params.commentEnabled": commentEnabled,
        "params.commentInterval": commentInterval,
      });
    } else if (account.platform == Platform.FNC) {
      const { commentInterval, postMode, postOffsets, postInterval, storyMode, storyOffsets, storyInterval, storyMaxCount, postCount, storyReplaceCount, commentEnabled } = params;
      await AccountService.updateParams(id, {
        "params.postMode": postMode,
        "params.postOffsets": postOffsets,
        "params.postInterval": postInterval,
        "params.postCount": postCount,
        "params.commentEnabled": commentEnabled,
        "params.commentInterval": commentInterval,
        "params.storyMode": storyMode,
        "params.storyOffsets": storyOffsets,
        "params.storyInterval": storyInterval,
        "params.storyMaxCount": storyMaxCount,
        "params.storyReplaceCount": storyReplaceCount,
      });
    } else if (account.platform == Platform.FAN) {
      const { postInterval, postCount, postMode, postOffsets, commentInterval, commentEnabled } = params;
      await AccountService.updateParams(id, {
        "params.postInterval": postInterval,
        "params.postCount": postCount,
        "params.postMode": postMode,
        "params.postOffsets": postOffsets,
        "params.commentEnabled": commentEnabled,
        "params.commentInterval": commentInterval,
      });
    } else if (account.platform == Platform.KNKY) {
      const { postInterval, postCount } = params;
      await AccountService.updateParams(id, {
        "params.postInterval": postInterval,
        "params.postCount": postCount,
        "params.postMode": PostMode.INTERVAL,
        "params.commentEnabled": false,
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
