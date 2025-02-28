const AccountService = require("../services/account");
const ChatTeamService = require("../services/chatteam");
const { sendResult, sendError, ApiError } = require("../utils/resp");

const handleLoadChatTeams = async (req, res) => {
  try {
    const teams = await ChatTeamService.loadTeams();
    sendResult(res, { teams });
  } catch (error) {
    sendError(res, error);
  }
};

const handleLoadAllChatTeams = async (req, res) => {
  try {
    const teams = await ChatTeamService.loadTeams();
    sendResult(res, { teams });
  } catch (error) {
    sendError(res, error);
  }
};

const handleCreateChatTeam = async (req, res) => {
  try {
    const { name, discord } = req.body;
    const dup = await ChatTeamService.findTeamByDiscord(discord);
    if (dup) throw new ApiError("Chat team already existed");
    await ChatTeamService.createTeam({ name, discord });
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleUpdateChatTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, ...params } = req.body;
    const team = await ChatTeamService.findTeamById(id);
    if (!team)
      throw new ApiError("Chat team does not exist")
    switch (action) {
      case "change":
        const { name, discord } = params;
        const dup = await ChatTeamService.findTeamByDiscord(discord);
        if (dup && dup._id != id)
          throw new ApiError("Chat team discord already existed");
        await ChatTeamService.changeTeam(id, { name, discord });
        break;
      default:
        throw new ApiError("Invalid chat team operation");
    }
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleDeleteChatTeam = async (req, res) => {
  try {
    const { id: teamId } = req.params;
    const team = await ChatTeamService.findTeamById(teamId);
    if (!team)
      throw new ApiError("Chat team does not exist.");
    const accounts = team.get("accounts");
    if (accounts.length > 0)
      throw new ApiError("Chat team is using by some accounts.");
    await ChatTeamService.deleteTeam(teamId);
    sendResult(res);
  } catch (error) {
    console.error(error);
    sendError(res, error);
  }
};

const handleDeleteBulkChatTeams = async (req, res) => {
  try {
    const { teamIds } = req.body;
    await ChatTeamService.deleteBulkTeams(teamIds);
    sendResult(res);
  } catch (error) {
    console.error(error);
    sendError(res, error);
  }
};

const handleAppendAccount = async (req, res) => {
  try {
    const { id: chatTeamId } = req.params;
    const { account: accountId } = req.body;
    // check if discord is valid
    const team = await ChatTeamService.findByTeamId(chatTeamId);
    if (!team) throw new ApiError("Chat team does not exist.");
    // check if actor is valid
    const account = await AccountService.findById(accountId)
    if (!account) throw new ApiError("Account does not exist.")
    // get old discord for actor
    const oldTeam = account.get("chatTeam");
    if (oldTeam) {
      if (oldTeam == chatTeamId) {
        throw new ApiError("Chat team already includes this model")
      } else {
        // remove actor from old discord
        await ChatTeamService.removeTeamAccount(oldTeam, account._id);
      }
    }
    await AccountService.setChatTeam(accountId, chatTeamId);
    // append actor to discord
    await ChatTeamService.appendTeamAccount(chatTeamId, account._id);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleRemoveAccount = async (req, res) => {
  try {
    const { id: teamId } = req.params;
    const { account: accountId } = req.body;
    // check if discord is valid
    const team = await ChatTeamService.findById(teamId);
    if (!team)
      throw new ApiError("Chat team does not exist.");
    // check if actor is valid
    const account = await AccountService.findById(accountId)
    if (!account) throw new ApiError("Account does not exist.");
    if (team.get("accounts").includes(accountId)) {
      await ChatTeamService.removeTeamAccount(teamId, accountId);
      await AccountService.setChatTeam(accountId, undefined)
    }
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const ChatTeamCtrl = {
  handleLoadAllChatTeams,
  handleLoadChatTeams,
  handleCreateChatTeam,
  handleDeleteChatTeam,
  handleDeleteBulkChatTeams,
  handleUpdateChatTeam,
  handleAppendAccount,
  handleRemoveAccount,
};

module.exports = ChatTeamCtrl;
