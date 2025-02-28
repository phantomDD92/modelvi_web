const ChatTeamModel = require("../models/chatteam");

const loadTeams = () =>
  ChatTeamModel.find()
    .populate({
      path: "accounts",
      select: "owner actor number platform alias ",
      populate: [
        { path: "owner", select: "name" },
        { path: "actor", select: "name" },
      ]
    })

const loadAllChatTeams = () =>
  ChatTeamModel.find({}, 'name')


const createTeam = ({ name, discord }) =>
  ChatTeamModel.create({ name, discord });

const changeTeam = (teamId, { name, discord }) =>
  ChatTeamModel.findByIdAndUpdate(teamId, { $set: { name, discord } });

const deleteTeam = (teamId) =>
  ChatTeamModel.findByIdAndDelete(teamId)

const deleteBulkTeams = (teamIds) =>
  ChatTeamModel.deleteMany({
    _id: { $in: teamIds },
    // accounts: { $exists: true, $ne: [] }
  });

const findTeamByDiscord = (discord) =>
  ChatTeamModel.findOne({ discord });

const appendTeamAccount = (teamId, accountId) => {
  return ChatTeamModel.findByIdAndUpdate(teamId, {
    $push: { accounts: accountId },
  });
};

const removeTeamAccount = (teamId, accountId) =>
  ChatTeamModel.findByIdAndUpdate(teamId, { $pull: { accounts: accountId } });

const getCount = () => ChatTeamModel.countDocuments()

const findTeamById = (teamId) =>
  ChatTeamModel.findById(teamId)

const ChatTeamService = {
  findTeamByDiscord,
  findTeamById,
  loadAllChatTeams,
  loadTeams,
  createTeam,
  deleteTeam,
  deleteBulkTeams,
  changeTeam,
  appendTeamAccount,
  removeTeamAccount,
  getCount,
};

module.exports = ChatTeamService;
