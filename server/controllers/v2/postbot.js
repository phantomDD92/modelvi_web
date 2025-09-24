const Random = require('random-js')
const jwt = require("jsonwebtoken");
const moment = require('moment');

const { ApiError, sendError, sendResult } = require("../../utils/resp");
const { DEFAULT_COMMENT_INTERVAL, DEFAULT_STORY_INTERVAL, DEFAULT_STORY_OFFSETS, DEFAULT_POST_OFFSETS, DEFAULT_CHAT_INTERVAL, DEFAULT_POST_INTERVAL } = require('../../utils/const');
const { PostMode, PostResultType } = require('../../config/const');
const { getPricePlan, getDateDelta, hasSufficientBalance, getAccountName, getNoBalanceEmailTemplate } = require('../../utils/helper');
const AccountService2 = require('../../services/v2/account');
const AgencyService2 = require('../../services/v2/agency');
const TransactionService2 = require('../../services/v2/transaction');
const NotifyUtils = require('../../utils/notifiy');
const ScheduleService2 = require('../../services/v2/schedule');
const ProxyNewService2 = require('../../services/v2/proxyNew');
const HistoryService2 = require('../../services/v2/history');
const CommentService2 = require('../../services/v2/comment');
const BlockUserService2 = require('../../services/v2/blockUser');
const ModelService2 = require('../../services/v2/model');
const LogService2 = require('../../services/v2/log');


const handleLoginAccount = async (req, res) => {
  try {
    const { platform } = req.params;
    const { alias } = req.body;
    const decodedAlias = Buffer.from(alias, 'base64').toString('ascii');
    const account = await AccountService2.findAccountByAlias(platform, decodedAlias);
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
    const accounts = await AccountService2.getLivingAccountsForPlatform(platform)
    sendResult(res, { accounts })
  } catch (error) {
    sendError(res, error)
  }
}


const handleGetAccount = async (req, res) => {
  try {
    await AccountService2.updateParameters(req.bot.id, { $set: { updatedAt: new Date() } });
    const account = await AccountService2.getAccountWithModelChat(req.bot.id);
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
    const account = await AccountService2.getAccount(req.bot.id);
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
    await AccountService2.updateParameters(req.bot.id, { $set: { updatedAt: new Date() } })
    sendResult(res)
  } catch (error) {
    sendError(res, error)
  }
}

const handleCreateHistory = async (req, res) => {
  try {
    const { action } = req.body;
    await HistoryService2.createHistory(req.bot.id, action);
    sendResult(res)
  } catch (error) {
    sendError(res, error)
  }
}

const handleCreateLastError = async (req, res) => {
  try {
    const { action, disabled } = req.body;
    const account = await AccountService2.getAccount(req.bot.id);
    const failures = (account.failures || 0);
    const status = !disabled && (failures < 10)
    // await HistoryService2.createHistory(req.bot.id, action);
    await AccountService2.updateParameters(req.bot.id, { $set: { lastError: action, status }, $inc: { failures: 1 } });
    sendResult(res)
  } catch (error) {
    sendError(res, error)
  }
}

const handleClearLastError = async (req, res) => {
  try {
    await AccountService2.updateParameters(req.bot.id, { $set: { lastError: "", failures: 0 } });
    sendResult(res)
  } catch (error) {
    sendError(res, error)
  }
}

const handleCommentInterval = async (req, res) => {
  try {
    const account = await AccountService2.getAccount(req.bot.id);
    const { params } = account.toJSON();
    await AccountService2.updateParameters(req.bot.id, { $set: { "params.commentNextTime": moment().add(params.commentInterval || 10, "minute").toDate() } })
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
    const account = await AccountService2.getAccount(req.bot.id);
    if (!account)
      throw new ApiError("unknown account")
    const actor = await ModelService2.getModelWithContents(account.actor._id);
    if (!actor)
      throw new ApiError("unknown model");
    const actorJson = actor.toJSON();
    const contents = actorJson.contents.filter(content => content.platforms.includes(account.platform) && content.media.length > 0 && content.media[0].name);
    await NotifyUtils.sendDebugMessage(`${account.platform} - ${account.alias}`, "Update contents", `update ${contents.length} contents from ${actorJson.contents?.length} contents`)
    await AccountService2.clearContents(req.bot.id);
    await AccountService2.setContents(req.bot.id, contents);
    sendResult(res, { count: contents.length });
  } catch (error) {
    sendError(res, error)
  }
}

const handleUpdateMedia = async (req, res) => {
  try {
    const { id, uuid, subject } = req.body;
    const account = await AccountService2.getAccount(req.bot.id);
    if (!account)
      throw new ApiError("unknown account")
    field = subject == "content_media" ? `params.contents.${id}.media.0.uuid` : `params.contents.${id}.preview.uuid`;
    await AccountService2.updateParameters(account, { $set: { [field]: uuid } });
    sendResult(res);
  } catch (error) {
    sendError(res, error)
  }
}

const handleUpdateChatSetting = async (req, res) => {
  try {
    const account = await AccountService2.getAccount(req.bot.id);
    if (!account)
      throw new ApiError("Invalid account");
    const accountJson = account.toJSON();
    const chatNextTime = moment().add(accountJson.params?.chatInterval || DEFAULT_CHAT_INTERVAL, "minute").toDate();
    await AccountService2.updateParameters(account, { $set: { "params.chatNextTime": chatNextTime } });
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
}

const handleUpdateScheduleSetting = async (req, res) => {
  try {
    const account = await AccountService2.getAccount(req.bot.id);
    if (!account)
      throw new ApiError("Invalid account");
    const scheduleNextTime = moment().add(20, "minute").toDate();
    await AccountService2.updateParameters(account, { $set: { "params.scheduleNextTime": scheduleNextTime } });
    // find expired schedules and set expired flag
    await ScheduleService2.setExpiredSchedules(req.bot.id);
    // find waiting and scheduled schedules
    const schedules = await ScheduleService2.loadLivingSchedules(req.bot.id)
    sendResult(res, { schedules });
  } catch (error) {
    sendError(res, error);
  }
}

const updateScheduleResult = async (req, res) => {
  try {
    const { result } = req.body;
    const account = await AccountService2.getAccount(req.bot.id);
    if (!account)
      throw new ApiError("Invalid account");
    NotifyUtils.sendDebugMessage(getAccountName(account), "Update Schedule Result", JSON.stringify(result))
    await ScheduleService2.updateScheduleResult(result);
    sendResult(res);
  } catch (error) {
    console.error(error)
    sendError(res, error);
  }
}

const handleUpdateScheduleResults = async (req, res) => {
  try {
    const { results } = req.body;
    const account = await AccountService2.getAccount(req.bot.id);
    if (!account)
      throw new ApiError("Invalid account");
    NotifyUtils.sendDebugMessage(getAccountName(account), "Update Schedule Results", JSON.stringify(results))
    await ScheduleService2.updateScheduleResults(results);
    sendResult(res);
  } catch (error) {
    console.error(error)
    sendError(res, error);
  }
}

const handleUpdateStorySetting = async (req, res) => {
  try {
    const { index } = req.body;
    const account = await AccountService2.getAccount(req.bot.id);
    if (!account)
      throw new ApiError("unknown account")
    const accountJson = account.toJSON();
    const storyMode = accountJson.params?.storyMode || PostMode.INTERVAL;
    const storyInterval = accountJson.params?.storyInterval || DEFAULT_STORY_INTERVAL;
    let offsets = accountJson.params?.storyOffsets || DEFAULT_STORY_OFFSETS;
    let storyNextTime;
    if (storyMode == PostMode.OFFSETS) {
      const currentTime = moment();
      const currentMinute = currentTime.minute()
      let storyNextOffset = offsets[0];
      for (let offset of offsets) {
        if (offset > currentMinute) {
          storyNextOffset = offset;
          break;
        }
      }
      if (storyNextOffset < currentMinute) {
        storyNextOffset += 60
      }
      storyNextTime = currentTime.add(storyNextOffset - currentMinute, "minute").toDate();
    } else {
      storyNextTime = moment().add(storyInterval, "minute").toDate();
    }
    await AccountService2.updateParameters(account, { $set: { "params.storyNextTime": storyNextTime, "params.storyIndex": index } });
    sendResult(res);
  } catch (error) {
    sendError(res, error)
  }
}

const handleUpdateCommentSetting = async (req, res) => {
  try {
    const account = await AccountService2.getAccount(req.bot.id);
    if (!account)
      throw new ApiError("unknown account")
    const accountJson = account.toJSON();
    // update comment interval
    const { commentInterval } = accountJson.params;
    const commentNextTime = moment().add(commentInterval || DEFAULT_COMMENT_INTERVAL, "minute").toDate();
    await AccountService2.updateParameters(account, { $set: { "params.commentNextTime": commentNextTime } });
    // load comments and block users
    const comments = await CommentService2.loadAgencyComments(req.bot.owner);
    const users = await BlockUserService2.loadAgencyBlockUsers(req.bot.owner);

    sendResult(res, { comments: comments.map(comment => comment.text), users });
  } catch (error) {
    sendError(res, error)
  }
}

const handleUpdateAccountId = async (req, res) => {
  try {
    const account = await AccountService2.getAccount(req.bot.id);
    if (!account)
      throw new ApiError("unknown account")
    const { alias, identifier } = req.body;
    await AccountService2.updateIdentifier(req.bot.id, { alias, identifier });
    sendResult(res);
  } catch (error) {
    sendError(res, error)
  }
}

const handleUpdatePostSetting = async (req, res) => {
  try {
    const { next, postId, deleteIds } = req.body;
    const account = await AccountService2.getAccount(req.bot.id);
    if (!account)
      throw new ApiError("unknown account")
    const { params } = account.toJSON();
    const { contents, postOffsets, postMode, postInterval, postStart, postLimit } = params;
    // append new post Id and get delete id list
    let postRemains = params.postRemains || [];
    if (deleteIds)
      postRemains = postRemains.filter(post => !deleteIds.includes(post));
    if (postId && postId != "undefined")
      postRemains.push(postId);
    // calculate next post index
    let newPostIndex = 0;
    if (contents.length > 0) {
      const postContentIndex = params.postContentIndex || 0;
      newPostIndex = next ? (postContentIndex + 1) % contents.length : postContentIndex;
    }

    // calculate next post time
    let postNextTime;
    let offsets = postOffsets || DEFAULT_POST_OFFSETS;
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
      postNextTime = moment().add(postInterval || DEFAULT_POST_INTERVAL, "minute").toDate();
    }
    await AccountService2.updateParameters(req.bot.id, {
      $set: {
        "params.postNextTime": postNextTime,
        "params.postContentIndex": newPostIndex,
        "params.postRemains": postRemains
      }
    });
    sendResult(res, { deleteIds: [] });
  } catch (error) {
    sendError(res, error)
  }
}

const handleUpdatePostResult = async (req, res) => {
  try {
    const { result, postId, deleteIds, nextTimeLimit } = req.body;
    const account = await AccountService2.getAccount(req.bot.id);
    if (!account)
      throw new ApiError("unknown account")
    const { params } = account.toJSON();
    const { contents, postOffsets, postMode, postInterval, postStart, postLimit } = params;
    const postIndex = params.postContentIndex || 0;

    // if the current posting content is invalid, remove it
    if (result == PostResultType.PROHIBITED) {
      const field = `params.contents.${postIndex}.deleted`;
      await AccountService2.updateParameters(account, { $set: { [field]: true } });
    }

    // append postId and delete deleteIds
    let postRemains = params.postRemains || [];
    if (deleteIds)
      postRemains = postRemains.filter(post => !deleteIds.includes(post));
    if (postId && postId != "undefined")
      postRemains.push(postId);

    // find the next posting content
    let newPostIndex = 0;
    for (var i = 0; i < contents.length; i++) {
      newPostIndex = (postIndex + 1 + i) % contents.length;
      if (!contents[newPostIndex].deleted)
        break;
    }

    // calculate next posting time
    let postNextTime;
    let offsets = postOffsets || DEFAULT_POST_OFFSETS;
    if (result > PostResultType.SUCCESS) {
      postNextTime = moment().add(1, "minute").toDate();
    } else if (postMode == "offsets") {
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
      postNextTime = moment().add(postInterval || DEFAULT_POST_INTERVAL, "minute").toDate();
    }
    // process next posting time limit
    if (nextTimeLimit && moment(postNextTime).isBefore(nextTimeLimit)) {
      postNextTime = moment(nextTimeLimit)
    }

    await AccountService2.updateParameters(req.bot.id, {
      $set: {
        "params.postNextTime": postNextTime,
        "params.postContentIndex": newPostIndex,
        "params.postRemains": postRemains
      }
    });
    sendResult(res);
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
      case "update_id":
        handleUpdateAccountId(req, res);
        break;
      case "content_media":
      case "content_preview":
        handleUpdateMedia(req, res);
        break;
      case "schedule_setting":
        handleUpdateScheduleSetting(req, res);
        break;
      case "schedule_results":
        handleUpdateScheduleResults(req, res);
        break;
      case "schedule_result":
        updateScheduleResult(req, res);
        break;
      case "post_setting":
        handleUpdatePostSetting(req, res);
        break;
      case "post_result":
        handleUpdatePostResult(req, res);
        break;
      case "chat_setting":
        handleUpdateChatSetting(req, res);
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

const handleChangeProxy = async (req, res) => {
  try {
    const account = await AccountService2.getAccount(req.bot.id);
    if (!account)
      throw new ApiError("unknown account");
    const proxy = await ProxyNewService2.pickupProxy();
    await AccountService2.changeProxy(account._id, proxy);
    sendResult(res)
  } catch (error) {
    sendError(res, error)
  }
}

const handleCheckBalance = async (req, res) => {
  try {
    let available = true;
    const { revenue } = req.body;

    // first check if account and agency is valid
    const account = await AccountService2.getAccountWithModel(req.bot.id);
    if (!account)
      throw new ApiError("Invalid bot account")
    const agency = await AgencyService2.getAgencyWithReferrer(req.bot.owner);
    if (!agency)
      throw new ApiError("Invalid bot agency");
    // calculate price + proxy fee
    const price = getPricePlan(agency, account.platform, revenue);
    const fee = price + 2.5;
    // get valid dates
    const dateDelta = getDateDelta(account.expiredAt);
    if (dateDelta <= 0) { // if account is expired
      if (hasSufficientBalance(agency, fee)) {
        // remove balance and create transaction, extend account
        const { balance } = await AgencyService2.updateBalance(agency._id, -1 * fee);
        const commission = price * (agency.referrer?.commission || 0) / 100;
        await TransactionService2.createExpenseTransaction(
          agency._id,
          account._id,
          fee,
          balance,
          balance - fee,
          `payout for ${account.platform} ${account.alias}`,
          commission
        );
        await AccountService2.extendAccount(account._id)
        NotifyUtils.sendExpenseMessage(agency, account, `Monthly Revenue: ${account.revenue}\nPrice: ${fee}\nBalance:$${balance.toFixed(2)} => $${(balance - fee).toFixed(2)}\n`)
      } else {
        available = false;
        const expiringAccounts = await AccountService2.getExpiringAccounts(agency._id);
        await AccountService2.disableAccount(account._id, "no balance");
        NotifyUtils.sendDebugMessage(getAccountName(account, agency), "Bot Closed With No Balance", `Monthly Revenue: ${account.revenue}\nPrice: ${fee}\nBalance:$${agency.balance?.toFixed(2)}\n`)
        await NotifyUtils.sendMail(agency.email, `🚫 Bot Paused – Insufficient Funds in Your ModelVI Account`, getNoBalanceEmailTemplate(agency, expiringAccounts));
      }
    } else if (dateDelta == 7) {
      // send notification
    } else if (dateDelta == 1) {
      // send notification
    }
    await AccountService2.updateRevenue(req.bot.id, revenue, price);
    sendResult(res, { available });
  } catch (error) {
    console.error(error);
    sendError(res, error)
  }
}

const handleTestBalance = async (req, res) => {
  try {
    const { revenue } = req.body;

    // first check if account and agency is valid
    const account = await AccountService2.getAccountWithModel(req.bot.id);
    if (!account)
      throw new ApiError("Invalid bot account")
    const agency = await AgencyService2.getAgencyWithReferrer(req.bot.owner);
    if (!agency)
      throw new ApiError("Invalid bot agency");
    // calculate price
    const price = getPricePlan(agency, account.platform, revenue);
    const commission = price * (agency.referrer?.commission || 0) / 100;
    NotifyUtils.sendDebugMessage(agency.name, "Test Price Plans", `Monthly Revenue: ${revenue}\nPrice: ${price}\nCommission Rate:$${agency.referrer?.commission || 0}\nCommission:${commission}\n`)
    // } else {
    sendResult(res);
  } catch (error) {
    console.error(error);
    sendError(res, error)
  }
}

const handleCreateLog = async (req, res) => {
  try {
    const params = req.body;
    const account = await AccountService2.getAccountWithAgencyAndModel(req.bot.id);
    if (!account)
      throw new ApiError("Invalid bot account")
    await LogService2.createLog(account, params);
    await HistoryService2.createHistory(account._id, params.message);
    if (params.disabled)
      await AccountService2.updateParameters(req.bot.id, { $set: { status: false } });
    if (params.error)
      await AccountService2.updateParameters(req.bot.id, { $set: { lastError: params.error } });
    if (params.notified)
      NotifyUtils.sendNotification(account.owner, account, params.message);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
}

const PostBotCtrl2 = {
  handleLoginAccount,
  handleLoadAccounts,
  handleGetAccount,
  handleGetCredential,
  handleUpdateAccount,
  handleChangeProxy,
  handleCreateHistory,
  handleCreateLastError,
  handleClearLastError,
  handleUpdateTime,
  handleCheckBalance,
  handleTestBalance,
  handleCreateLog,
};

module.exports = PostBotCtrl2