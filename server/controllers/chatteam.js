const AccountService = require("../services/account");
const ActorService = require("../services/actor");
const ChatTeamService = require("../services/chatteam");
const { sendResult, sendError, ApiError } = require("../utils/resp");

const handleLoadChatTeams = async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const [teams, teamsCount] = await ChatTeamService.loadChatTeams({ page, pageSize: pageSize || "10" });
    sendResult(res, { teams, teamsCount });
  } catch (error) {
    sendError(res, error);
  }
};

const handleLoadAllChatTeams = async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const [teams, teamsCount] = await ChatTeamService.loadChatTeams({ page, pageSize: pageSize || "10" });
    sendResult(res, { teams, teamsCount });
  } catch (error) {
    sendError(res, error);
  }
};

const handleCreateChatTeam = async (req, res) => {
  try {
    const { name, discord } = req.body;
    const dup = await ChatTeamService.findByDiscord(discord);
    if (dup) throw new ApiError("Chat team is already existed");
    await ChatTeamService.createChatTeam({ name, discord });
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleUpdateChatTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, discord } = req.body;
    const team = await ChatTeamService.findById(id);
    if (!team)
      throw new ApiError("Chat team does not exist.")
    const dup = await ChatTeamService.findByDiscord(discord);
    if (dup && dup._id != id) throw new ApiError("Chat team discord is already existed");
    await ChatTeamService.updateChatTeam(id, { name, discord });
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleDeleteChatTeam = async (req, res) => {
  try {
    const { id } = req.body;
    const team = await ChatTeamService.findById(id);
    if (!team) throw new ApiError("Chat team does not exist.");
    const accounts = team.get("accounts");
    if (accounts.length > 0)
      throw new ApiError("Chat team is using by some accounts.");
    await ChatTeamService.deleteChatTeam(id);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleAppendAccount = async (req, res) => {
  try {
    const { id: chatTeamId } = req.params;
    const { account: accountId } = req.body;
    // check if discord is valid
    const team = await ChatTeamService.findById(chatTeamId);
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
        await ChatTeamService.removeAccount(oldTeam, account._id);
      }
    }
    await AccountService.setChatTeam(accountId, chatTeamId);
    // append actor to discord
    await ChatTeamService.appendAccount(chatTeamId, account._id);
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
      await ChatTeamService.removeAccount(teamId, accountId);
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
  handleUpdateChatTeam,
  handleAppendAccount,
  handleRemoveAccount,
};

module.exports = ChatTeamCtrl;
