const moment = require('moment');

const AccountService2 = require("../../services/v2/account");
const ModelService2 = require("../../services/v2/model");
const ProxyNewService2 = require("../../services/v2/proxyNew");
const AgencyService2 = require("../../services/v2/agency");

const NotifyUtils = require("../../utils/notifiy");
const { isModelOwner, getAgencyName, getAccountName } = require("../../utils/helper");
const { sendResult, sendError, ApiError } = require("../../utils/resp");

const handleLoadAccountsForAgency = async (req, res) => {
  try {
    const { platform } = req.params;
    const { search } = req.query;
    const accounts = await AccountService2.loadAgencyAccounts(req.manager._id, { platform, search });
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
    const accounts = await AccountService2.loadAccountsForAdmin({ platform, agency, search, status });
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
    // check model
    let model = await ModelService2.findModelById(modelId);
    if (!model)
      throw new ApiError(`Model does not exist.`);
    // check model ownership
    if (!isModelOwner(model, req.manager))
      throw new ApiError(`Account can be accessible by owner.`);
    // check account duplication
    const { alias } = params;
    const dupAccount = await AccountService2.findAccountByAlias(platform, alias);
    if (dupAccount && !dupAccount.deleted)
      throw new ApiError(`Account alias(${alias}) already exists.`);
    // pick up proxy
    const proxy = await ProxyNewService2.pickupProxy();
    // create account
    const account = await AccountService2.createAccount(platform, model, { ...params, chatTeam, creator: req.manager._id, proxy });
    await ModelService2.appendAccount(modelId, account._id)
    // create discord message
    NotifyUtils.sendMessage(getAgencyName(req.manager), getAccountName(account, model, req.manager), `CREATE A ACCOUNT`);
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
    // check model
    let model = await ModelService2.findModelById(modelId);
    if (!model)
      throw new ApiError(`Model does not exist.`);
    // check duplication
    const { alias } = params;
    const dupAccount = await AccountService2.findAccountByAlias(platform, alias);
    if (dupAccount)
      throw new ApiError(`Account alias(${alias}) already exists.`);
    // pick up proxy
    const proxy = await ProxyNewService2.pickupProxy();
    // create account
    const account = await AccountService2.createAccount(platform, model, { ...params, chatTeam, creator: req.manager._id, proxy });
    await ModelService2.appendAccount(modelId, account._id)
    NotifyUtils.sendMessage(getAgencyName(req.manager, true), getAccountName(account, model), `CREATE A ACCOUNT`);
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
    // check account
    if (!account)
      throw new ApiError("Account does not exist.");
    // check ownership
    if (!isModelOwner(account, req.manager))
      throw new ApiError(`Account can be accessible by owner.`)
    // remove account
    await ModelService2.removeAccount(account.actor?._id, accountId);
    await AccountService2.deleteAccount(accountId);
    NotifyUtils.sendMessage(getAgencyName(req.manager), getAccountName(account), `DELETE A ACCOUNT`);
    sendResult(res);
  } catch (error) {
    sendError(res, error)
  }
};

const handleDeleteAccountForAdmin = async (req, res) => {
  try {
    const { accountId } = req.params;
    const account = await AccountService2.findAccountById(accountId);
    // check account
    if (!account)
      throw new ApiError("Account does not exist.");
    if (account.deleted) {
      await AccountService2.removeAccount(accountId);
      NotifyUtils.sendMessage(getAgencyName(req.manager, true), getAccountName(account), `REMOVE A ACCOUNT`);
    } else {
      await ModelService2.removeAccount(account.actor?._id, accountId);
      await AccountService2.deleteAccount(accountId);
      NotifyUtils.sendMessage(getAgencyName(req.manager, true), getAccountName(account), `DELETE A ACCOUNT`);
    }
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
        const model = await ModelService2.findModelById(actor);
        if (!model)
          throw new ApiError("Model does not exist.");
        await AccountService2.updateAccount(accountId, model, { ...others });
        NotifyUtils.sendMessage(getAgencyName(req.manager), getAccountName(account), `CHANGE A ACCOUNT`);
        break;
      case "status":
        const { status } = params;
        await AccountService2.setStatus(accountId, status);
        const agency = await AgencyService2.findAgencyById(req.manager._id)
        if ((agency.balance || 0) <= 0)
          throw new ApiError("Agency has insufficient funds to start bot.");
        NotifyUtils.sendMessage(getAgencyName(req.manager), getAccountName(account), `${status ? 'START' : 'STOP'} A ACCOUNT`);
        break;
      case "setting":
        await AccountService2.updateParameters(accountId, { $set: { params: { ...account.params, ...params } } });
        NotifyUtils.sendMessage(getAgencyName(req.manager), getAccountName(account), `UPDATE A ACCOUNT'S SETTINGS`);
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
        const model = await ModelService2.findModelById(actor);
        if (!model)
          throw new ApiError("Model does not exist.");
        await AccountService2.updateAccount(accountId, model, { chatTeam, ...others });
        NotifyUtils.sendMessage(getAgencyName(req.manager, true), getAccountName(account), `CHANGE A ACCOUNT`);
        break;
      case "status":
        const { status } = params;
        const agency = await AgencyService2.findAgencyById(account.owner);
        if ((agency.balance || 0) <= 0)
          throw new ApiError("Agency has insufficient funds to start bot.");
        await AccountService2.setStatus(accountId, status);
        NotifyUtils.sendMessage(getAgencyName(req.manager, true), getAccountName(account), `${status ? 'START' : 'STOP'} A ACCOUNT`);
        break;
      case "setting":
        await AccountService2.updateParameters(accountId, { $set: { params: { ...account.params, ...params } } });
        NotifyUtils.sendMessage(getAgencyName(req.manager, true), getAccountName(account), `UPDATE A ACCOUNT'S SETTINGS`);
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
        if ((agency.balance || 0) <= 0)
          throw new ApiError("Agency has insufficient funds to start bots.");
        const accounts = await AccountService2.getAccounts(accountIds, req.manager._id);
        const agencyAccountIds = accounts.map(account => account._id);
        await AccountService2.updateAccountsStatus(agencyAccountIds, status);
        NotifyUtils.sendMessage(
          getAgencyName(req.manager),
          `${accounts.map(account => getAccountName(account)).join("\n\t")}`,
          `${status ? 'START' : 'STOP'} ${accounts.length} ACCOUNTS`);
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
        const realAccountIds = accounts.map(account => account._id);
        await AccountService2.updateAccountsStatus(realAccountIds, status);
        NotifyUtils.sendMessage(
          getAgencyName(req.manager, true),
          `${accounts.map(account => getAccountName(account)).join("\n\t")}`,
          `${status ? 'START' : 'STOP'} ${accounts.length} ACCOUNTS`);
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
      getAgencyName(req.manager),
      `${accounts.map(account => getAccountName(account)).join("\n\t")}`,
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
      getAgencyName(req.manager, true),
      `${accounts.map(account => getAccountName(account)).join("\n\t")}`,
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
    const accounts = await AccountService2.getIdentifiers(platform);
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