const moment = require("moment");
const LikeBotModel = require("../../models/likebot");
const { generateBotAlias, generateRandomPassword } = require("../../utils/helper");
const LikeHistoryModel = require("../../models/likehistory");

const findBotByPlatformAndEmail = (platform, email) =>
  LikeBotModel.findOne({ platform, email });

const createBots = (platform, users, proxies) => {
  let bots = users.map(({ firstName, lastName, gender, birthday, orientation, role, city }) => {
    const alias = generateBotAlias(firstName, lastName);
    const proxyIndex = Math.round(Math.random() * (proxies.length - 1))
    return ({
      insertOne: {
        document: {
          platform,
          firstName,
          lastName,
          gender,
          orientation,
          role,
          city,
          birthday: moment(birthday).toDate(),
          alias,
          email: `${alias}@voure.nl`,
          proxy: proxies[proxyIndex],
          password: generateRandomPassword()
        }
      }
    });
  })
  return LikeBotModel.bulkWrite(bots);
}

const changeStatus = (botId, status) =>
  LikeBotModel.findByIdAndUpdate(botId, { $set: { status, "params.followNextTime": new Date() } });

const changeBulkStatus = (botIds, status) =>
  LikeBotModel.updateMany({ _id: { $in: botIds } }, { $set: { status, "params.followNextTime": new Date() } });

const findBotById = (botId) =>
  LikeBotModel.findById(botId);

const deleteBot = (botId) =>
  LikeBotModel.findByIdAndDelete(botId);

const deleteBots = (botIds) =>
  LikeBotModel.deleteMany({ _id: { $in: botIds } });

const loadBots = (platform, { search, page, pageSize }) => {
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
  return Promise.all([
    LikeBotModel.find(query)
      .skip((parseInt(page) - 1) * parseInt(pageSize))
      .limit(parseInt(pageSize)),
    LikeBotModel.countDocuments(query),
  ]);
}

const findBotByAlias = (alias) =>
  LikeBotModel.findOne({ alias });

const setAccountRegistered = (botId) =>
  LikeBotModel.findByIdAndUpdate(botId, { $set: { registered: true } });

const setAccountVerified = (botId) =>
  LikeBotModel.findByIdAndUpdate(botId, { $set: { verified: true } });

const setLastError = (botId, lastError = "", disabled) =>
  LikeBotModel.findByIdAndUpdate(botId, { $set: { lastError } });

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

const setBotProxy = (botId, proxy) =>
  LikeBotModel.findByIdAndUpdate(botId, { $set: { proxy } });

const updateParams = (botId, params) =>
  LikeBotModel.findByIdAndUpdate(botId, { $set: params });

const getLivingBots = (platform) =>
  LikeBotModel
    .find({ platform, status: true, $or: [{ "params.likeNextTime": { $lt: new Date() } }, { "params.likeNextTime": { $exists: false } }] }, "alias")
    .sort("params.likeNextTime");

const updateLikeParams = (botId, likeNextTime, likeCount, commentCount) =>
  LikeBotModel.findByIdAndUpdate(botId, { $set: { "params.likeNextTime": likeNextTime, updatedAt: new Date() }, $inc: { likes: likeCount, comments: commentCount } });

const updateFollowParams = (botId, followNextTime, followCount) =>
  LikeBotModel.findByIdAndUpdate(botId, { $set: { "params.followNextTime": followNextTime, updatedAt: new Date() }, $inc: { followings: followCount } });

const updateBotSettings = (platform, { followInterval, likeInterval, likeLimit }) =>
  LikeBotModel.updateMany({ platform }, {
    $set: {
      "params.followInterval": followInterval,
      "params.likeInterval": likeInterval,
      "params.likeLimit": likeLimit,
    }
  });

const LikeBotService2 = {
  findBotByPlatformAndEmail,
  createBots,
  findBotById,
  findBotByAlias,
  deleteBot,
  deleteBots,
  changeStatus,
  changeBulkStatus,
  loadBots,
  setAccountRegistered,
  setAccountVerified,
  setLastError,
  setBotDevice,
  setBotProxy,
  loadHistories,
  createHistory,
  clearHistory,
  updateParams,
  updateLikeParams,
  updateFollowParams,
  getLivingBots,
  updateBotSettings,
}

module.exports = LikeBotService2;