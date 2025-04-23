const ChatTeamModel = require("../../models/chatteam");


const loadTeams = () =>
  ChatTeamModel.find()

const createTeam = ({ name, discord }) =>
  ChatTeamModel.create({ name, discord });

const changeTeam = (teamId, { name, discord }) =>
  ChatTeamModel.findByIdAndUpdate(teamId, { $set: { name, discord } });

const deleteTeam = (teamId) =>
  ChatTeamModel.findByIdAndDelete(teamId)

const deleteTeams = (teamIds) =>
  ChatTeamModel.deleteMany({ _id: { $in: teamIds } });

const findTeamByDiscord = (discord) =>
  ChatTeamModel.findOne({ discord });

const appendTeamAccount = (teamId, accountId) => {
  return ChatTeamModel.findByIdAndUpdate(teamId, {
    $push: { accounts: accountId },
  });
};

const removeTeamAccount = (teamId, accountId) =>
  ChatTeamModel.findByIdAndUpdate(teamId, { $pull: { accounts: accountId } });

const findTeamById = (teamId) =>
  ChatTeamModel.findById(teamId)

const getCount = () =>
  ChatTeamModel.countDocuments({});

const ChatTeamService2 = {
  findTeamByDiscord,
  findTeamById,
  loadTeams,
  createTeam,
  deleteTeam,
  deleteTeams,
  changeTeam,
  appendTeamAccount,
  removeTeamAccount,
  getCount,
};

module.exports = ChatTeamService2;
