const jwt = require("jsonwebtoken");
const moment = require("moment");
const LikeBotService2 = require("../../services/v2/liketbot");
const { sendError, sendResult, ApiError } = require("../../utils/resp");
const AccountService2 = require("../../services/v2/account");
const ProxyNewService2 = require("../../services/v2/proxyNew");

const handleLoadLikeBotsForAdmin = async (req, res) => {
  try {
    const { platform } = req.params;
    const { search } = req.query;
    const bots = await LikeBotService2.loadBots(platform, { search });
    sendResult(res, { bots });
  } catch (error) {
    sendError(res, error);
  }
}

const handleAppendLikeBotsForAdmin = async (req, res) => {
  try {
    const { platform } = req.params;
    const { users } = req.body;
    const proxies = await ProxyNewService2.loadProxies();
    await LikeBotService2.createBots(platform, users, proxies.map(proxy => proxy.url));
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
}

const handleChangeLikeBotForAdmin = async (req, res) => {
  try {
    const { botId } = req.params;
    const bot = await LikeBotService2.findBotById(botId);
    if (!bot)
      throw new ApiError("Like bot does not exist.");
    const { action, ...params } = req.body;
    switch (action) {
      case "status":
        const { status } = params;
        await LikeBotService2.changeStatus(botId, status);
        break;
      default:
        throw new ApiError("Invalid like bot operation");
    }
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
}

const handleDeleteLikeBotForAdmin = async (req, res) => {
  try {
    const { botId } = req.params;
    const bot = await LikeBotService2.findBotById(botId);
    if (!bot)
      throw new ApiError("Like bot does not exist.");
    await LikeBotService2.deleteBot(botId);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
}

const handleCheckBotForBot = async (req, res) => {
  try {
    const { alias } = req.body;
    const decodedAlias = Buffer.from(alias, 'base64').toString('ascii');
    const bot = await LikeBotService2.findBotByAlias(decodedAlias);
    if (!bot)
      throw new ApiError(`Like bot does not exist`);
    const token = jwt.sign(
      { id: bot._id },
      process.env.SECRET_KEY || "SECRET_KEY_FNC",
      { expiresIn: "1y" }
    );
    sendResult(res, { token })
  } catch (error) {
    console.error(error);
    sendError(res, error)
  }
}

const handleGetBotForBot = async (req, res) => {
  try {
    const bot = await LikeBotService2.findBotById(req.bot.id);
    if (!bot)
      throw new ApiError(`Like bot does not exist`);
    sendResult(res, { account: bot })
  } catch (error) {
    console.error(error)
    sendError(res, error)
  }
}

const handleUpdateBotForBot = async (req, res) => {
  try {
    const { action, ...params } = req.body;
    const bot = await LikeBotService2.findBotById(req.bot.id);
    if (!bot)
      throw new ApiError(`Like bot does not exist`);
    switch (action) {
      case "register":
        await LikeBotService2.setAccountRegistered(req.bot.id);
        break;
      case "verify":
        await LikeBotService2.setAccountVerified(req.bot.id);
        break;
      case "proxy":
        const proxy = await ProxyNewService2.pickupProxy();
        await LikeBotService2.setBotProxy(req.bot.id, proxy);
        break;
      case "device":
        const { device } = params;
        await LikeBotService2.setBotDevice(req.bot.id, device);
        break;
      case "like":
        await LikeBotService2.updateParams(req.bot.id, {
          "params.likeNextTime": moment().add(bot.params?.likeInterval || 20, "minute").toDate()
        });
        break;
      case "follow":
        await LikeBotService2.updateParams(req.bot.id, {
          "params.followNextTime": moment().add(bot.params?.followInterval || 12, "hour").toDate()
        });
        break;
      default:
        throw new ApiError("Unsupported bot operation");
    }
    sendResult(res)
  } catch (error) {
    console.error(error)
    sendError(res, error)
  }
}

const handleLoadBotsForBot = async (req, res) => {
  try {
    const { platform } = req.params;
    const accounts = await LikeBotService2.getLivingBots(platform);
    sendResult(res, { accounts: accounts })
  } catch (error) {
    sendError(res, error)
  }
}

const handleLoadTeamsForBot = async (req, res) => {
  try {
    const { platform } = req.params;
    const teams = await AccountService2.getIdentifiers(platform);
    sendResult(res, { teams })
  } catch (error) {
    sendError(res, error)
  }
}

const handleCreateHistoryForBot = async (req, res) => {
  try {
    const { action } = req.body;
    await LikeBotService2.createHistory(req.bot.id, action);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
}

const handleSetErrorForBot = async (req, res) => {
  try {
    const { action, disabled } = req.body;
    await LikeBotService2.setLastError(req.bot.id, action, disabled);
    if (action != "")
      await LikeBotService2.createHistory(req.bot.id, action);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
}

const LikeBotCtrl2 = {
  handleLoadLikeBotsForAdmin,
  handleDeleteLikeBotForAdmin,
  handleChangeLikeBotForAdmin,
  handleAppendLikeBotsForAdmin,

  handleLoadBotsForBot,
  handleCheckBotForBot,
  handleGetBotForBot,
  handleUpdateBotForBot,
  handleLoadTeamsForBot,
  handleCreateHistoryForBot,
  handleSetErrorForBot,
}

module.exports = LikeBotCtrl2