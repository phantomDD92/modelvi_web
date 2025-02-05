const ChatTeamModel = require("../models/chatteam");

const loadChatTeams = ({ page, pageSize }) =>
  Promise.all([
    ChatTeamModel.find()
      .skip((parseInt(page) - 1) * parseInt(pageSize))
      .limit(parseInt(pageSize))
      .populate({
        path: "accounts",
        select: "owner actor number platform alias ",
        populate: [
          { path: "owner", select: "name" },
          { path: "actor", select: "name" },
        ]
      }),
    ChatTeamModel.countDocuments()
  ])

const loadAllChatTeams = () =>
  ChatTeamModel.find({}, 'name')


const createChatTeam = ({ name, discord }) => {
  return ChatTeamModel.create({ name, discord });
};

const updateChatTeam = (id, { name, discord }) =>
  ChatTeamModel.findByIdAndUpdate(id, { $set: { name, discord } });


const deleteChatTeam = (id) =>
  ChatTeamModel.findByIdAndDelete(id)

const findByDiscord = (discord) =>
  ChatTeamModel.findOne({ discord });


const appendAccount = (id, accountId) => {
  return ChatTeamModel.findByIdAndUpdate(id, {
    $push: { accounts: accountId },
  });
};

const removeAccount = (id, accountId) =>
  ChatTeamModel.findByIdAndUpdate(id, { $pull: { accounts: accountId } });

const getCount = () => ChatTeamModel.countDocuments()

const findById = (id) => ChatTeamModel.findById(id)




const ChatTeamService = {
  loadAllChatTeams,
  loadChatTeams,
  createChatTeam,
  deleteChatTeam,
  updateChatTeam,
  findByDiscord,
  findById,
  appendAccount,
  removeAccount,
  getCount,
};

module.exports = ChatTeamService;
