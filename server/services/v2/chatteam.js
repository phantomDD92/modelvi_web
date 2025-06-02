const ChatTeamModel = require("../../models/chatteam");

const loadTeams = () =>
  ChatTeamModel.find()
    .sort("owner")
    .populate("owner", "name");

const createTeam = ({ name, discord }, agencyId = undefined) =>
  ChatTeamModel.create({ name, discord, owner: agencyId });

const changeTeam = (teamId, { name, discord }) =>
  ChatTeamModel.findByIdAndUpdate(teamId, { $set: { name, discord } });

const deleteTeam = (teamId) =>
  ChatTeamModel.findByIdAndDelete(teamId)

const deleteTeams = (teamIds) =>
  ChatTeamModel.deleteMany({ _id: { $in: teamIds } });

const findTeamByDiscord = (discord) =>
  ChatTeamModel.findOne({ discord });

const findTeamByAgencyDiscord = (agencyId, discord) =>
  ChatTeamModel.findOne({ owner: agencyId, discord });

const findTeamById = (teamId) =>
  ChatTeamModel.findById(teamId)

const getCount = () =>
  ChatTeamModel.countDocuments({});

const loadAgencyTeams = (agencyId) =>
  ChatTeamModel.find({ owner: agencyId }).populate("owner", "name");

const createAgencyTeam = (agencyId, { name, discord }) =>
  ChatTeamModel.create({ name, discord, owner: agencyId });

const deleteAgencyTeams = (agencyId, teamIds) =>
  ChatTeamModel.deleteMany({ _id: { $in: teamIds }, owner: agencyId });

const getTeam = (teamId) =>
  ChatTeamModel.findById(teamId).populate("owner", "name");

const ChatTeamService2 = {
  findTeamByDiscord,
  findTeamByAgencyDiscord,
  findTeamById,
  loadTeams,
  createTeam,
  deleteTeam,
  deleteTeams,
  changeTeam,
  getCount,
  loadAgencyTeams,
  createAgencyTeam,
  deleteAgencyTeams,
  getTeam,
};

module.exports = ChatTeamService2;
