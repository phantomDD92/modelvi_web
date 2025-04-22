const AccountService2 = require("../../services/v2/account");
const ChatTeamService2 = require("../../services/v2/chatteam");
const ModelService2 = require("../../services/v2/model");
const { isModelOwner } = require("../../utils/helper");
const NotifyUtils = require("../../utils/notifiy");
const { sendResult, sendError } = require("../../utils/resp");

const loadAccountStatsForAdmin = async (req, res) => {
  try {
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
}

const handleLoadAccountsForAgency = async (req, res) => {
  try {
    const { platform } = req.params;
    const { search } = req.query;
    const accounts = await AccountService2.loadAgencyAccounts(platform, req.manager._id, search);
    sendResult(res, { accounts });
  } catch (error) {
    console.error(error);
    sendError(res, error);
  }
};


const handleLoadAccountsForAdmin = async (req, res) => {
  try {
    const { platform } = req.params;
    const { agency, search } = req.query;
    const accounts = await AccountService2.loadAccounts(platform, { agency, search });
    sendResult(res, { accounts });
  } catch (error) {
    console.error(error);
    sendError(res, error);
  }
};

const handleCreateAccountForAgency = async (req, res) => {
  try {
    const { platform } = req.params;
    const { actor: modelId, chatTeam, ...params } = req.body;
    let model = await ModelService2.getModel(modelId);
    if (!model)
      throw new ApiError(`Model does not exist.`);
    if (!isModelOwner(model, req.manager))
      throw new ApiError(`Account can be accessible by owner.`);
    // check duplication
    const { alias } = params;
    const dupAccount = await AccountService2.findAccountByAlias(platform, alias);
    if (dupAccount)
      throw new ApiError(`Account alias(${alias}) already exists.`);
    const account = await AccountService2.createAccount(platform, model, { ...params, chatTeam, creator: req.manager._id });
    await ModelService2.appendAccount(modelId, account._id)
    if (chatTeam)
      await ChatTeamService2.appendTeamAccount(chatTeam, account._id);
    NotifyUtils.sendMessage(
      `${req.manager.name}`,
      `${model.number}. ${model.name} - ${platform} ${alias}`,
      `CREATE A ACCOUNT`);
    sendResult(res);
  } catch (error) {
    console.error(error);
    sendError(res, error);
  }
};

const handleCreateAccountForAdmin = async (req, res) => {
  try {
    const { platform } = req.params;
    const { actor: modelId, chatTeam, ...params } = req.body;
    let model = await ModelService2.getModel(modelId);
    if (!model)
      throw new ApiError(`Model does not exist.`);
    // check duplication
    const { alias } = params;
    const dupAccount = await AccountService2.findAccountByAlias(platform, alias);
    if (dupAccount)
      throw new ApiError(`Account alias(${alias}) already exists.`);
    const account = await AccountService2.createAccount(platform, model, { ...params, chatTeam, creator: req.manager._id });
    await ModelService2.appendAccount(modelId, account._id)
    if (chatTeam)
      await ChatTeamService2.appendTeamAccount(chatTeam, account._id);
    NotifyUtils.sendMessage(
      `${req.manager.name} (Admin)`,
      `${model.number}. ${model.name} - ${platform} ${alias}`,
      `CREATE A ACCOUNT`);
    sendResult(res);
  } catch (error) {
    console.error(error);
    sendError(res, error);
  }
};

const handleDeleteAccountForAgency = async (req, res) => {
  try {
    const { accountId } = req.params;
    const account = await AccountService2.findAccountById(accountId);
    if (!account)
      throw new ApiError("Account does not exist.");
    if (!isModelOwner(account, req.manager))
      throw new ApiError(`Account can be accessible by owner.`)
    await AccountService2.removeAccount(account.actor?._id, accountId);
    if (account.chatTeam)
      await ChatTeamService2.removeTeamAccount(account.chatTeam, accountId)
    await AccountService2.deleteAccount(accountId);
    NotifyUtils.sendMessage(
      `${req.manager.name}`,
      `${account.actor?.number}. ${account.actor?.name} - ${account.platform} ${account.alias}`,
      `DELETE A ACCOUNT`);
    sendResult(res);
  } catch (error) {
    sendError(res, error)
  }
};

const handleDeleteAccountForAdmin = async (req, res) => {
  try {
    const { accountId } = req.params;
    const account = await AccountService2.findAccountById(accountId);
    if (!account)
      throw new ApiError("Account does not exist.");
    await AccountService2.removeAccount(account.actor?._id, accountId);
    if (account.chatTeam)
      await ChatTeamService2.removeTeamAccount(account.chatTeam, accountId)
    await AccountService2.deleteAccount(accountId);
    NotifyUtils.sendMessage(
      `${req.manager.name} (Admin)`,
      `${account.actor?.number}. ${account.actor?.name} - ${account.platform} ${account.alias}`,
      `DELETE A ACCOUNT`);
    sendResult(res);
  } catch (error) {
    sendError(res, error)
  }
};

const handleUpdateAccountForAgency = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { action, ...params } = req.body;
    const account = await AccountService2.findAccountById(accountId);
    if (!account)
      throw new ApiError("Account does not exist.");
    if (!isModelOwner(account, req.manager))
      throw new ApiError(`Account can be accessible by owner.`)
    switch (action) {
      case "change":
        const { actor, chatTeam, ...others } = params;
        const model = await ModelService2.getModel(actor);
        if (!model)
          throw new ApiError("Model does not exist.");
        await AccountService2.updateAccount(accountId, model, { chatTeam, ...others });
        if (account.chatTeam)
          await ChatTeamService2.removeTeamAccount(account.chatTeam, accountId)
        if (chatTeam)
          await ChatTeamService2.appendTeamAccount(chatTeam, accountId)
        break;
      case "status":
        const { status } = params;
        await AccountService2.setStatus(accountId, status);
        NotifyUtils.sendMessage(
          `${req.manager.name}`,
          `${account.actor?.number}. ${account.actor?.name} - ${account.platform} ${account.alias}`,
          `${status ? 'ENABLE' : 'DISABLE'} A BOT`);
        break;
      case "setting":
        await AccountService2.updateParams(accountId, { params: { ...account.params, ...params } });
        break;
      default:
        throw new ApiError("Invalid account operation");
    }
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleUpdateAccountForAdmin = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { action, ...params } = req.body;
    const account = await AccountService2.findAccountById(accountId);
    if (!account)
      throw new ApiError("Account does not exist.");
    switch (action) {
      case "change":
        const { actor, chatTeam, ...others } = params;
        const model = await ModelService2.getModel(actor);
        if (!model)
          throw new ApiError("Model does not exist.");
        await AccountService2.updateAccount(accountId, model, { chatTeam, ...others });
        if (account.chatTeam)
          await ChatTeamService2.removeTeamAccount(account.chatTeam, accountId)
        if (chatTeam)
          await ChatTeamService2.appendTeamAccount(chatTeam, accountId)
        break;
      case "status":
        const { status } = params;
        await AccountService2.setStatus(accountId, status);
        NotifyUtils.sendMessage(
          `${req.manager.name}`,
          `${account.actor?.number}. ${account.actor?.name} - ${account.platform} ${account.alias}`,
          `${status ? 'ENABLE' : 'DISABLE'} A BOT`);
        break;
      case "setting":
        await AccountService2.updateParams(accountId, { params: { ...account.params, ...params } });
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
        NotifyUtils.sendMessage(
          `${req.manager.name} (${req.manager.role == AdminRole.MANAGER ? "Admin" : "Agency"})`,
          `${accounts.map(account => `${account.actor?.number}. ${account.actor?.name} - ${account.platform} ${account.alias}`).join(", ")}`,
          `${status ? 'ENABLE' : 'DISABLE'} ${accounts.length} BOTS`);
        break;
      case "all":
        await AccountService.setAllStatus(req.manager, platform, status);
        NotifyUtils.sendMessage(
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
        await ChatTeamService2.removeTeamAccount(account.chatTeam, account._id)
    }
    await AccountService.deleteBulkAccounts(req.manager, accountIds);
    NotifyUtils.sendMessage(
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

const AccountCtrl2 = {
  loadAccountStatsForAdmin,
}

module.exports = AccountCtrl2;