const moment = require("moment");
const LikeBotModel = require("../../models/likebot");
const { generateBotAlias, generateRandomPassword } = require("../../utils/helper");
const LikeHistoryModel = require("../../models/likehistory");

const findBotByPlatformAndEmail = (platform, email) =>
  LikeBotModel.findOne({ platform, email });

const createBots = (platform, users) => {
  let bots = users.map(({ firstName, lastName, gender, birthday }) => {
    const alias = generateBotAlias(firstName, lastName);
    return ({
      insertOne: {
        document: {
          platform,
          firstName,
          lastName,
          gender,
          birthday: moment(birthday).toDate(),
          alias,
          email: `${alias}@voure.nl`,
          password: generateRandomPassword()
        }
      }
    });
  })
  return LikeBotModel.bulkWrite(bots);
}

const findBotById = (botId) =>
  LikeBotModel.findById(botId);

const deleteBot = (botId) =>
  LikeBotModel.findByIdAndDelete(botId);

const loadBots = (platform, { search }) => {
  const searchQuery = search && search != ""
    ? {
      $or: [
        { alias: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ]
    }
    : {}
  const query = {
    platform,
    ...searchQuery,
  }
  return LikeBotModel.find(query)
}

const findBotByAlias = (alias) =>
  LikeBotModel.findOne({ alias });

const setAccountRegistered = (botId) =>
  LikeBotModel.findByIdAndUpdate(botId, { $set: { registered: true } });

const setAccountVerified = (botId) =>
  LikeBotModel.findByIdAndUpdate(botId, { $set: { verified: true } });

const setLastError = (botId, lastError = "", disabled) =>
  LikeBotModel.findByIdAndUpdate(botId, { $set: { lastError, status: !disabled } });

const setBotDevice = (botId, device) =>
  LikeBotModel.findByIdAndUpdate(botId, { $set: { device } });

const createHistory = (botId, action) =>
  LikeHistoryModel.create({ bot: botId, action });

const loadHistories = (botId, { page, pageSize }) =>
  Promise.all([
    LikeHistoryModel
      .find({ bot: botId })
      .sort("-createdAt")
      .skip((parseInt(page) - 1) * parseInt(pageSize))
      .limit(parseInt(pageSize)),
    LikeHistoryModel.countDocuments({ bot: botId })
  ])

const clearHistory = (botId) =>
  LikeHistoryModel.deleteMany({ bot: botId })

const LikeBotService2 = {
  findBotByPlatformAndEmail,
  createBots,
  findBotById,
  findBotByAlias,
  deleteBot,
  loadBots,
  setAccountRegistered,
  setAccountVerified,
  setLastError,
  setBotDevice,
  loadHistories,
  createHistory,
  clearHistory,
}

module.exports = LikeBotService2;