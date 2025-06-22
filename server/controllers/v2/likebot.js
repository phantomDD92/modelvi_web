const jwt = require("jsonwebtoken");
const LikeBotService2 = require("../../services/v2/liketbot");
const { checkLikeBotEmail } = require("../../utils/helper");
const { sendError, sendResult, ApiError } = require("../../utils/resp")

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

const handleCreateLikeBotForAdmin = async (req, res) => {
  try {
    const { platform } = req.params;
    const { name, email, password } = req.body;
    const dupBot = await LikeBotService2.findBotByPlatformAndEmail(platform, email);
    if (dupBot)
      throw new ApiError(`Like bot for ${email} already exists.`);
    const checked = await checkLikeBotEmail(email, password);
    if (!checked)
      throw new ApiError(`Please check email and password.`);
    await LikeBotService2.createBot({ platform, name, email, password });
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

const handleLoadBotsForBot = async (req, res) => {
  try {
    const { platform } = req.params;
    const accounts = await LikeBotService2.loadBots(platform);
    sendResult(res, { accounts: accounts.map(account => account.alias) })
  } catch (error) {
    sendError(res, error)
  }
}


const LikeBotCtrl2 = {
  handleLoadLikeBotsForAdmin,
  handleDeleteLikeBotForAdmin,
  handleChangeLikeBotForAdmin,
  handleCreateLikeBotForAdmin,

  handleLoadBotsForBot,
  handleCheckBotForBot,
  handleGetBotForBot,
}

module.exports = LikeBotCtrl2