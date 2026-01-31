const AccountService2 = require("../../services/v2/account");
const ModelService2 = require("../../services/v2/model");
const ProxyNewService2 = require("../../services/v2/proxyNew");

const NotifyUtils = require("../../utils/notifiy");
const { isModelOwner } = require("../../utils/helper");
const { sendResult, sendError, ApiError } = require("../../utils/resp");
const AgencyService2 = require("../../services/v2/agency");
const moment = require('moment');

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
    const { agency, search, status } = req.query;
    const accounts = await AccountService2.loadAccounts(platform, { agency, search, status });
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
    if (dupAccount && !dupAccount.deleted)
      throw new ApiError(`Account alias(${alias}) already exists.`);
    const proxy = await ProxyNewService2.pickupProxy();
    const account = await AccountService2.createAccount(platform, model, { ...params, chatTeam, creator: req.manager._id, proxy });
    await ModelService2.appendAccount(modelId, account._id)
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
    const proxy = await ProxyNewService2.pickupProxy();
    const account = await AccountService2.createAccount(platform, model, { ...params, chatTeam, creator: req.manager._id, proxy });
    await ModelService2.appendAccount(modelId, account._id)
    NotifyUtils.sendMessage(
      `${req.manager.name} (Admin)`,
      `${model.number}. ${model.name} - [${platform}] ${alias}`,
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
    await ModelService2.removeAccount(account.actor?._id, accountId);
    await AccountService2.deleteAccount(accountId);
    NotifyUtils.sendMessage(
      `${req.manager.name}`,
      `${account.owner?.name} - ${account.actor?.number}. ${account.actor?.name} - [${account.platform}] ${account.alias}`,
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
    await ModelService2.removeAccount(account.actor?._id, accountId);
    await AccountService2.deleteAccount(accountId);
    NotifyUtils.sendMessage(
      `${req.manager.name} (Admin)`,
      `${account.owner?.name} - ${account.actor?.number}. ${account.actor?.name} - [${account.platform}] ${account.alias}`,
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
    const account = await AccountService2.getAccount(accountId);
    if (!account)
      throw new ApiError("Account does not exist.");
    if (!isModelOwner(account, req.manager))
      throw new ApiError(`Account can be accessible by owner.`)
    switch (action) {
      case "change":
        const { actor, ...others } = params;
        const model = await ModelService2.getModel(actor);
        if (!model)
          throw new ApiError("Model does not exist.");
        await AccountService2.updateAccount(accountId, model, { ...others });
        break;
      case "status":
        const { status } = params;
        await AccountService2.setStatus(accountId, status);
        const agency = await AgencyService2.findAgencyById(req.manager._id)
        if ((agency.balance || 0) < agency.fee)
          throw new ApiError("Agency has insufficient funds to start bot.");
        NotifyUtils.sendMessage(
          `${req.manager.name}`,
          `${account.owner?.name} - ${account.actor?.number}. ${account.actor?.name} - [${account.platform}] ${account.alias}`,
          `${status ? 'ENABLE' : 'DISABLE'} A BOT`);
        break;
      case "setting":
        await AccountService2.updateParameters(accountId, { $set: { params: { ...account.params, ...params } } });
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
    const account = await AccountService2.getAccount(accountId);
    if (!account)
      throw new ApiError("Account does not exist.");
    switch (action) {
      case "change":
        const { actor, chatTeam, ...others } = params;
        const model = await ModelService2.getModel(actor);
        if (!model)
          throw new ApiError("Model does not exist.");
        await AccountService2.updateAccount(accountId, model, { chatTeam, ...others });
        break;
      case "status":
        const { status } = params;
        const agency = await AgencyService2.findAgencyById(account.owner);
        if ((agency.balance || 0) < agency.fee)
          throw new ApiError("Agency has insufficient funds to start bot.");
        await AccountService2.setStatus(accountId, status);
        NotifyUtils.sendMessage(
          `${req.manager.name} (Admin)`,
          `${account.owner?.name} ${account.actor?.number}. ${account.actor?.name} - [${account.platform}] ${account.alias}`,
          `${status ? 'ENABLE' : 'DISABLE'} A BOT`);
        break;
      case "setting":
        await AccountService2.updateParameters(accountId, { $set: { params: { ...account.params, ...params } } });
        break;
      case "repost":
        await AccountService2.updateParameters(accountId, { $set: { params: { ...account.params, "postNextTime": moment().subtract(1, "month").toDate() } } });
        break;
      default:
        throw new ApiError("Invalid account operation");
    }
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleUpdateAccountsForAgency = async (req, res) => {
  try {
    const { platform } = req.params;
    const { action, accountIds, status } = req.body;
    switch (action) {
      case "status":
        const agency = await AgencyService2.findAgencyById(req.manager._id)
        if ((agency.balance || 0) < agency.fee)
          throw new ApiError("Agency has insufficient funds to start bots.");
        const accounts = await AccountService2.getAccounts(accountIds, req.manager._id);
        const agencyAccountIds = accounts.map(account => account._id);
        await AccountService2.updateAccountsStatus(agencyAccountIds, status);
        NotifyUtils.sendMessage(
          `${req.manager.name}`,
          `${accounts.map(account => `${account.owner?.name} - ${account.actor?.number}. ${account.actor?.name} - [${account.platform}] ${account.alias}`).join("\n")}`,
          `${status ? 'ENABLE' : 'DISABLE'} ${accounts.length} BOTS`);
        break;
      default:
        throw new ApiError("Invalid account operation");
    }
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleUpdateAccountsForAdmin = async (req, res) => {
  try {
    const { platform } = req.params;
    const { action, accountIds, status } = req.body;
    switch (action) {
      case "status":
        const accounts = await AccountService2.getAccounts(accountIds);
        await AccountService2.updateAccountsStatus(accountIds, status);
        NotifyUtils.sendMessage(
          `${req.manager.name} (Admin)`,
          `${accounts.map(account => `${account.owner?.name} - ${account.actor?.number}. ${account.actor?.name} - [${account.platform}] ${account.alias}`).join("\n")}`,
          `${status ? 'ENABLE' : 'DISABLE'} ${accounts.length} BOTS`);
        break;
      default:
        throw new ApiError("Invalid account admin operation");
    }
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleDeleteAccountsForAgency = async (req, res) => {
  try {
    const { accountIds } = req.body;
    const accounts = await AccountService2.getAccounts(accountIds, req.manager._id);
    const agencyAccountIds = accounts.map(account => account._id);
    for (var account of accounts) {
      await ModelService2.removeAccount(account.actor?._id, account._id);
    }
    await AccountService2.deleteAccounts(agencyAccountIds);
    NotifyUtils.sendMessage(
      `${req.manager.name} (${req.manager.role == AdminRole.MANAGER ? "Admin" : "Agency"})`,
      `${accounts.map(account => `${account.owner?.name} - ${account.actor?.number}. ${account.actor?.name} - [${account.platform}] ${account.alias}`).join("\n")}`,
      `DELETE ${accounts.length} ACCOUNTS`);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleDeleteAccountsForAdmin = async (req, res) => {
  try {
    const { accountIds } = req.body;
    const accounts = await AccountService2.getAccounts(accountIds);
    for (var account of accounts) {
      await ModelService2.removeAccount(account.actor?._id, account._id);
    }
    await AccountService2.deleteAccounts(accountIds);
    NotifyUtils.sendMessage(
      `${req.manager.name} (Admin)`,
      `${accounts.map(account => `${account.owner?.name} - ${account.actor?.number}. ${account.actor?.name} - [${account.platform}] ${account.alias}`).join("\n")}`,
      `DELETE ${accounts.length} ACCOUNTS`);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleLoadAccountList = async (req, res) => {
  try {
    const accounts = await AccountService2.getAgencyAccounts(req.manager._id);
    sendResult(res, { accounts });
  } catch (error) {
    sendError(res, error)
  }
}

const handleLoadAccountsForBot = async (req, res) => {
  try {
    const { platform } = req.params;
    const accounts = await AccountService2.getLivingAccountsForPlatform(platform);
    sendResult(res, { accounts })
  } catch (error) {
    sendError(res, error)
  }
}

const AccountCtrl2 = {
  handleLoadAccountsForAdmin,
  handleCreateAccountForAdmin,
  handleUpdateAccountsForAdmin,
  handleDeleteAccountsForAdmin,
  handleUpdateAccountForAdmin,
  handleDeleteAccountForAdmin,

  handleLoadAccountsForAgency,
  handleCreateAccountForAgency,
  handleUpdateAccountsForAgency,
  handleDeleteAccountsForAgency,
  handleUpdateAccountForAgency,
  handleDeleteAccountForAgency,

  handleLoadAccountList,

  handleLoadAccountsForBot
}

module.exports = AccountCtrl2;