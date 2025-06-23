const moment = require("moment");
const LikeBotModel = require("../../models/likebot");
const { generateBotAlias, generateRandomPassword } = require("../../utils/helper");

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

const LikeBotService2 = {
  findBotByPlatformAndEmail,
  createBots,
  findBotById,
  findBotByAlias,
  deleteBot,
  loadBots,
}

module.exports = LikeBotService2;