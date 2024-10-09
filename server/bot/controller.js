const Random = require('random-js')
const random = new Random.Random();
const AccountService = require("../services/account");
const jwt = require("jsonwebtoken");
const { ApiError, sendError, sendResult } = require("../utils/resp");
const ProxyService = require("../services/proxy");
const HistoryService = require('../services/history');
const LogService = require('../services/log');
const ActionService = require('../services/action');
const moment = require('moment');

const handleLoginAccount = async (req, res) => {
  try {
    const { platform } = req.params;
    const { alias } = req.body;
    const decodedAlias = Buffer.from(alias, 'base64').toString('ascii');
    const account = await AccountService.findByAlias(platform, decodedAlias);
    if (!account)
      throw new ApiError(`unknown account`);
    const { email, password } = account.toJSON();
    const token = jwt.sign(
      { id: account._id, owner: account.owner, actor: account.actor },
      process.env.SECRET_KEY || "SECRET_KEY_FNC",
      { expiresIn: "1y" }
    );
    sendResult(res, {
      token,
      e: Buffer.from(email).toString('base64'),
      p: Buffer.from(password).toString('base64'),
    })
  } catch (error) {
    sendError(res, error)
  }
}

const handleLoadAccounts = async (req, res) => {
  try {
    const { platform } = req.params;
    const accounts = await AccountService.getAccountNames(platform)
    const accountNames = accounts.map(account => account.alias);
    sendResult(res, { accounts: accountNames })
  } catch (error) {
    sendError(res, error)
  }
}


const handleGetAccount = async (req, res) => {
  try {
    await AccountService.updateParams(req.bot.id, { updatedAt: new Date() });
    const account = await AccountService.findById(req.bot.id);
    if (!account)
      throw new ApiError("unknown account")
    const { email, password, ...params } = account.toJSON()
    sendResult(res, { account: params })
  } catch (error) {
    sendError(res, error)
  }
}


const handleGetCredential = async (req, res) => {
  try {
    const account = await AccountService.findById(req.bot.id);
    if (!account)
      throw new ApiError("unknown account")
    const { email, password } = account.toJSON()
    sendResult(res, { e: Buffer.from(email).toString('base64'), p: Buffer.from(password).toString('base64') })
  } catch (error) {
    sendError(res, error)
  }
}

const handleUpdateTime = async (req, res) => {
  try {
    await AccountService.updateParams(req.bot.id, { updatedAt: new Date() })
    sendResult(res)
  } catch (error) {
    sendError(res, error)
  }
}

const handleCreateHistory = async (req, res) => {
  try {
    const { action } = req.body;
    await HistoryService.createHistory(req.bot.id, action);
    sendResult(res)
  } catch (error) {
    sendError(res, error)
  }
}

const handleCreateLastError = async (req, res) => {
  try {
    const { action } = req.body;
    await HistoryService.createHistory(req.bot.id, action);
    await AccountService.updateParams(req.bot.id, { lastError: action });
    sendResult(res)
  } catch (error) {
    sendError(res, error)
  }
}

const handleClearLastError = async (req, res) => {
  try {
    // await HistoryService.clearHistory(req.bot.id);
    await AccountService.updateParams(req.bot.id, { lastError: "" });
    await HistoryService.createHistory(req.bot.id, "bot started");
    sendResult(res)
  } catch (error) {
    sendError(res, error)
  }
}


const handleCreateLog = async (req, res) => {
  try {
    const { platform, alias, level, message, stack } = req.body;
    await LogService.createLog({ platform, alias, level, message, stack })
    sendResult(res)
  } catch (error) {
    sendError(res, error)
  }
}

const handleCommentInterval = async (req, res) => {
  try {
    const account = await AccountService.findById(req.bot.id);
    const { params } = account.toJSON();
    await AccountService.updateParams(req.bot.id, {"params.commentNextTime": moment().add(params.commentInterval || 10, "minute").toDate()})
    sendResult(res);
  } catch (error) {
    sendError(res, error)
  }
}

const handleUpdateAccount = async (req, res) => {
  try {
    const { subject } = req.body;
    console.log("### : ", subject)
    switch (subject) {
      case 'commentInterval':
        handleCommentInterval(req, res);
        break
        // case 'history':
        //   handleCreateHistory(req, res);
        break;
      default:
        throw new ApiError("Unknown Api Request")
    }
  } catch (error) {
    sendError(res, error)
  }
}


const handleChangeAccount = async (req, res) => {
  try {
    const proxies = await ProxyService.loadProxiesForOwner(req.bot.owner)
    if (!proxies || proxies.length == 0)
      throw new ApiError("No proxies found")
    const idx = random.integer(0, proxies.length - 1)
    const [account, addr] = proxies[idx].url.split("@");
    const scheme = proxies[idx].protocol;
    const [user, pass] = account.split(":")
    sendResult(res, {
      proxy: {
        server: `${scheme}://${addr}`,
        username: user,
        password: pass,
      }
    })
  } catch (error) {
    sendError(res, error)
  }
}


const handlePickProxy = async (req, res) => {
  try {
    const proxies = await ProxyService.loadProxiesForOwner(req.bot.owner)
    if (!proxies || proxies.length == 0)
      throw new ApiError("no proxies")
    const idx = random.integer(0, proxies.length - 1)
    const [account, addr] = proxies[idx].url.split("@");
    const scheme = proxies[idx].protocol;
    const [user, pass] = account.split(":")
    sendResult(res, {
      proxy: {
        server: `${scheme}://${addr}`,
        username: user,
        password: pass,
      }
    })
  } catch (error) {
    sendError(res, error)
  }
}

const handleFindCommentAction = async (req, res) => {
  try {
    const {uuid, action} = req.body;
    const record = await ActionService.findAction(req.bot.id, uuid, action);
    let found = true;
    if (!record)
      found = false;
    sendResult(res, { found });
  } catch (error) {
    sendError(res, error)
  }
}

const handleCreateCommentAction = async (req, res) => {
  try {
    const {creator, uuid, action} = req.body;
    await ActionService.createAction(req.bot.id, creator, uuid, action);
    await HistoryService.createHistory(req.bot.id, `bot followed ${creator}'s post`);
    sendResult(res);
  } catch (error) {
    sendError(res, error)
  }
}

const BotController = {
  handleLoginAccount,
  handleLoadAccounts,
  handleGetAccount,
  handleChangeAccount,
  handleGetCredential,
  handleUpdateAccount,
  handlePickProxy,
  handleCreateHistory,
  handleCreateLastError,
  handleClearLastError,
  handleCreateLog,
  handleUpdateTime,
  handleFindCommentAction,
  handleCreateCommentAction,
};

module.exports = BotController