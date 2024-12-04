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
const ActorService = require('../services/actor');
const { DEFAULT_FOLLOW_INTERVAL, DEFAULT_COMMENT_INTERVAL } = require('../utils/const');
const { default: mongoose } = require('mongoose');
const CommentService = require('../services/comment');
const UserService = require('../services/user');

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
    // const { ...params } = account.toJSON()
    sendResult(res, { account: account.toJSON() })
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
    await AccountService.updateParams(req.bot.id, { lastError: action, status: false });
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
    await AccountService.updateParams(req.bot.id, { "params.commentNextTime": moment().add(params.commentInterval || 10, "minute").toDate() })
    sendResult(res);
  } catch (error) {
    sendError(res, error)
  }
}

/**
 * Update account's contents from model
 * @param {Request} req 
 * @param {Response} res 
 */
const handleUpdateContents = async (req, res) => {
  try {
    const account = await AccountService.findById(req.bot.id);
    if (!account)
      throw new ApiError("unknown account")
    const actor = await ActorService.findById(account.actor._id);
    if (!actor)
      throw new ApiError("unknown actor");
    const actorJson = actor.toJSON();
    const contents = actorJson.contents.filter(content => content.platforms.includes(account.platform));
    await AccountService.clearContents(req.bot.id);
    await AccountService.setContents(req.bot.id, contents);
    sendResult(res, { count: contents.length });
  } catch (error) {
    sendError(res, error)
  }
}

const handleUpdateMedia = async (req, res) => {
  try {
    const { id, uuid, subject } = req.body;
    const account = await AccountService.findById(req.bot.id);
    if (!account)
      throw new ApiError("unknown account")
    field = subject == "content_media" ? `params.contents.${id}.media.0.uuid` : `params.contents.${id}.preview.uuid`;
    await AccountService.updateParams(account, { [field]: uuid });
    sendResult(res);
  } catch (error) {
    sendError(res, error)
  }
}

const handleUpdateFollowSetting = async (req, res) => {
  try {
    const account = await AccountService.findById(req.bot.id);
    if (!account)
      throw new ApiError("unknown account")
    const accountJson = account.toJSON();
    const { followInterval } = accountJson.params;
    const followNextTime = moment().add(followInterval || DEFAULT_FOLLOW_INTERVAL, "minute").toDate();
    await AccountService.updateParams(account, { "params.followNextTime": followNextTime });
    sendResult(res);
  } catch (error) {
    sendError(res, error)
  }
}

const handleUpdateStorySetting = async (req, res) => {
  try {
    const account = await AccountService.findById(req.bot.id);
    if (!account)
      throw new ApiError("unknown account")
    const accountJson = account.toJSON();
    const { storyInterval } = accountJson.params;
    const storyNextTime = moment().add(storyInterval || DEFAULT_STORY_INTERVAL, "minute").toDate();
    await AccountService.updateParams(account, { "params.storyNextTime": storyNextTime });
    sendResult(res);
  } catch (error) {
    sendError(res, error)
  }
}

const handleUpdateCommentSetting = async (req, res) => {
  try {
    const account = await AccountService.findById(req.bot.id);
    if (!account)
      throw new ApiError("unknown account")
    const accountJson = account.toJSON();
    // update comment interval
    const { commentInterval } = accountJson.params;
    const commentNextTime = moment().add(commentInterval || DEFAULT_COMMENT_INTERVAL, "minute").toDate();
    await AccountService.updateParams(account, { "params.commentNextTime": commentNextTime });
    // load comments and block users
    const comments = await CommentService.loadComments(req.bot.owner);
    const users = await UserService.loadUsers(req.bot.owner);

    // const comments = await CommentService.loadComments();
    // const users = await UserService.loadUsers();

    sendResult(res, { comments: comments.map(comment => comment.text), users });
  } catch (error) {
    sendError(res, error)
  }
}

const handleUpdatePostSetting = async (req, res) => {
  try {
    const { next, postId } = req.body;
    const account = await AccountService.findById(req.bot.id);
    if (!account)
      throw new ApiError("unknown account")
    const { params } = account.toJSON();
    const { contents, postOffsets, postMode, postInterval, postStart, postLimit, postContentIndex } = params;
    if (contents.length == 0)
      throw new ApiError("no contents");
    // append new post Id and get delete id list
    let postRemains = params.postRemains || [];
    let postCount = params.postCount || 10;
    if (postId && postId != "undefined")
      postRemains.push(postId);
    let deleteIds = []
    while (postRemains.length > postCount) {
      const deleteId = postRemains.shift();
      deleteIds.push(deleteId);
    }
    // calculate next post index
    let newPostIndex = next ? (postContentIndex + 1) % contents.length : postContentIndex;

    // calculate next post time
    let postNextTime;
    let offsets = postOffsets | [1, 21, 51];
    if (postMode == "offsets") {
      const currentTime = moment();
      const currentMinute = currentTime.minute()
      let postNextOffset = offsets[0];
      for (let offset of offsets) {
        if (offset > currentMinute) {
          postNextOffset = offset;
          break;
        }
      }
      if (postNextOffset < currentMinute) {
        postNextOffset += 60
      }
      postNextTime = currentTime.add(postNextOffset - currentMinute, "minute").toDate();
    } else if (postMode == "limited") {
      const currentTime = moment();
      let startTime = moment(postStart || "12:00", "HH:mm");
      if (currentTime.isBefore(startTime))
        startTime.add(-1, "day");
      let nextTime = moment(startTime);
      let found = false
      for (var i = 1; i < (postLimit || 10); ++i) {
        nextTime.add(postInterval, "minute");
        if (nextTime.isAfter(currentTime)) {
          found = true;
          break;
        }
      }
      if (!found) {
        nextTime = moment(startTime);
        nextTime.add(1, "day");
      }
      postNextTime = nextTime.toDate();
    } else {
      postNextTime = moment().add(postInterval || 10, "minute").toDate();
    }
    await AccountService.updateParams(account, { "params.postNextTime": postNextTime, "params.postContentIndex": newPostIndex, "params.postRemains": postRemains });
    sendResult(res, { deleteIds });
  } catch (error) {
    sendError(res, error)
  }
}

const handleUpdateAccount = async (req, res) => {
  try {
    const { subject } = req.body;
    switch (subject) {
      case 'commentInterval':
        handleCommentInterval(req, res);
        break
      case "update_contents":
        handleUpdateContents(req, res);
        break;
      case "content_media":
      case "content_preview":
        handleUpdateMedia(req, res);
        break;
      case "post_setting":
        handleUpdatePostSetting(req, res);
        break;
      case "follow_setting":
        handleUpdateFollowSetting(req, res);
        break;
      case "comment_setting":
        handleUpdateCommentSetting(req, res);
        break;
      case "story_setting":
        handleUpdateStorySetting(req, res);
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


const handleBlockProxy = async (req, res) => {
  try {
    const account = await AccountService.findById(req.bot.id);
    if (!account)
      throw new ApiError("unknown account");
    const { owner, platform, alias } = account.toJSON();
    let proxy = await ProxyService.findByAccount(owner, platform, alias);
    if (!proxy)
      throw new ApiError("proxy not found");
    await ProxyService.setProxyAccount(proxy._id, platform, "blocked");
    sendResult(res)
  } catch (error) {
    sendError(res, error)
  }
}

const handlePickProxy = async (req, res) => {
  try {
    const account = await AccountService.findById(req.bot.id);
    if (!account)
      throw new ApiError("unknown account");
    const { owner, platform, alias } = account.toJSON();
    let proxy = await ProxyService.findByAccount(owner, platform, alias);
    if (!proxy) {
      proxy = await ProxyService.findByAccount(owner, platform);
      if (!proxy)
        throw new ApiError("no proxy");
    }
    await ProxyService.setProxyAccount(proxy._id, platform, alias);
    const proxyJson = proxy.toJSON();
    sendResult(res, { proxy: proxyJson.url });
  } catch (error) {
    sendError(res, error)
  }
}

const handleFindCommentAction = async (req, res) => {
  try {
    const { uuid, action } = req.body;
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
    const { creator, uuid, action } = req.body;
    await ActionService.createAction(req.bot.id, creator, uuid, action);
    await HistoryService.createHistory(req.bot.id, `bot followed ${creator}'s post`);
    sendResult(res);
  } catch (error) {
    sendError(res, error)
  }
}

const handleGetIdleAccounts = async (req, res) => {
  const { platform, console, count } = req.body;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const users = await User.find({ status: 'inactive' }).limit(3).session(session);
    sendResult(res);
  } catch (error) {
    sendError(res, error)
  }
}

const handleReleaseAccounts = async (req, res) => {
  try {
    const { platform, console } = req.body;
    await AccountService.releaseAccounts(platform, console);
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
  handleBlockProxy,
  handleCreateHistory,
  handleCreateLastError,
  handleClearLastError,
  handleCreateLog,
  handleUpdateTime,
  handleFindCommentAction,
  handleCreateCommentAction,

  // bot console
  handleGetIdleAccounts,
  handleReleaseAccounts,
};

module.exports = BotController