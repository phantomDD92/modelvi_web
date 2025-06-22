const { v4: uuidv4 } = require('uuid')
const LikeBotModel = require("../../models/likebot");
const { generateRandomPassword } = require("../../utils/helper");

const findBotByPlatformAndEmail = (platform, email) =>
  LikeBotModel.findOne({ platform, email });

const createBot = ({ platform, name, email, password }) =>
  LikeBotModel.create({ platform, alias: uuidv4(), name, email, password: generateRandomPassword(), emailPassword: password })

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

const LikeBotService2 = {
  findBotByPlatformAndEmail,
  createBot,
  findBotById,
  findBotByAlias,
  deleteBot,
  loadBots,
}

module.exports = LikeBotService2;