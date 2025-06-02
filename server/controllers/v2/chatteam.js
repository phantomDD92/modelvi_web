const AccountService2 = require("../../services/v2/account");
const ChatTeamService2 = require("../../services/v2/chatteam");
const { isModelOwner } = require("../../utils/helper");
const { sendResult, sendError, ApiError } = require("../../utils/resp");

const handleLoadChatTeamsForAdmin = async (req, res) => {
  try {
    const teams = await ChatTeamService2.loadTeams();
    const teamsStat = await AccountService2.getStatsByChatTeam();
    sendResult(res, { teams, teamsStat });
  } catch (error) {
    sendError(res, error);
  }
};

const handleCreateChatTeamForAdmin = async (req, res) => {
  try {
    const { name, discord } = req.body;
    const dup = await ChatTeamService2.findTeamByDiscord(discord);
    if (dup) throw new ApiError("Chat team already existed");
    await ChatTeamService2.createTeam({ name, discord });
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleUpdateChatTeamForAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, ...params } = req.body;
    const team = await ChatTeamService2.findTeamById(id);
    if (!team)
      throw new ApiError("Chat team does not exist")
    switch (action) {
      case "change":
        const { name, discord } = params;
        const dup = await ChatTeamService2.findTeamByDiscord(discord);
        if (dup && dup._id != id)
          throw new ApiError("Chat team discord already existed");
        await ChatTeamService2.changeTeam(id, { name, discord });
        break;
      default:
        throw new ApiError("Invalid chat team operation");
    }
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleDeleteChatTeamForAdmin = async (req, res) => {
  try {
    const { id: teamId } = req.params;
    const team = await ChatTeamService2.findTeamById(teamId);
    if (!team)
      throw new ApiError("Chat team does not exist.");
    const accounts = team.get("accounts");
    if (accounts.length > 0)
      throw new ApiError("Chat team is using by some accounts.");
    await AccountService2.removeChatTeam(teamId);
    await ChatTeamService2.deleteTeam(teamId);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleDeleteChatTeamsForAdmin = async (req, res) => {
  try {
    const { teamIds } = req.body;
    await AccountService2.removeChatTeams(teamIds);
    await ChatTeamService2.deleteTeams(teamIds);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleLoadChatTeamsForAgency = async (req, res) => {
  try {
    const teams = await ChatTeamService2.loadAgencyTeams(req.manager._id);
    const teamsStat = await AccountService2.getStatsByChatTeam();
    sendResult(res, { teams, teamsStat });
  } catch (error) {
    sendError(res, error);
  }
};

const handleCreateChatTeamForAgency = async (req, res) => {
  try {
    const { name, discord } = req.body;
    const dup = await ChatTeamService2.findTeamByAgencyDiscord(req.manager._id, discord);
    if (dup) throw new ApiError("Chat team already existed");
    await ChatTeamService2.createAgencyTeam(req.manager._id, { name, discord });
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleDeleteChatTeamsForAgency = async (req, res) => {
  try {
    const { teamIds } = req.body;
    await ChatTeamService2.deleteAgencyTeams(req.manager._id, teamIds);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleDeleteChatTeamForAgency = async (req, res) => {
  try {
    const { id: teamId } = req.params;
    const team = await ChatTeamService2.findTeamById(teamId);
    if (!team)
      throw new ApiError("Chat team does not exist.");
    if (!isModelOwner(team, req.manager))
      throw new ApiError(`Chat team can be deleted by owner.`);
    await AccountService2.removeChatTeam(teamId);
    await ChatTeamService2.deleteTeam(teamId);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleUpdateChatTeamForAgency = async (req, res) => {
  try {
    const { id: teamId } = req.params;
    const { action, ...params } = req.body;
    const team = await ChatTeamService2.findTeamById(teamId);
    if (!team)
      throw new ApiError("Chat team does not exist")
    if (!isModelOwner(team, req.manager))
      throw new ApiError("Chat team can be updated only by owner");

    switch (action) {
      case "change":
        const { name, discord } = params;
        const dup = await ChatTeamService2.findTeamByAgencyDiscord(req.manager._id, discord);
        if (dup && dup._id != teamId)
          throw new ApiError("Chat team discord already existed");
        await ChatTeamService2.changeTeam(teamId, { name, discord });
        break;
      default:
        throw new ApiError("Invalid chat team operation");
    }
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const ChatTeamCtrl2 = {
  // handleLoadAllChatTeams,
  handleLoadChatTeamsForAdmin,
  handleCreateChatTeamForAdmin,
  handleDeleteChatTeamForAdmin,
  handleDeleteChatTeamsForAdmin,
  handleUpdateChatTeamForAdmin,

  handleLoadChatTeamsForAgency,
  handleCreateChatTeamForAgency,
  handleDeleteChatTeamForAgency,
  handleDeleteChatTeamsForAgency,
  handleUpdateChatTeamForAgency,

}

module.exports = ChatTeamCtrl2;