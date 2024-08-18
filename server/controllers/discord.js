const ActorService = require("../services/actor");
const DiscordService = require("../services/discord");
const { sendResult, sendError, ApiError } = require("../utils/resp");

const handleLoadDiscords = async (req, res) => {
  try {
    const {page, pageSize} = req.query;
    const [discords, discordsCount] = await DiscordService.loadDiscords({page, pageSize: pageSize || "10"});
    sendResult(res, { discords, discordsCount });
  } catch (error) {
    sendError(res, error);
  }
};

const handleCreateDiscord = async (req, res) => {
  try {
    const { url, desc } = req.body;
    const dup = await DiscordService.findByUrl(url);
    if (dup) throw new ApiError("discord url is already existed");
    await DiscordService.createDiscord({ url, desc });
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleUpdateDiscord = async (req, res) => {
  try {
    const { id } = req.params;
    const { url, desc } = req.body;
    const discord = await DiscordService.findById(id);
    if (!discord)
      throw new ApiError("discord is not existed.")
    const dup = await DiscordService.findByUrl(url);
    if (dup && dup._id != id) throw new ApiError("discord url is already existed");
    await DiscordService.updateDiscord(id, { url, desc });
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleDeleteDiscord = async (req, res) => {
  try {
    const { id } = req.params;
    const discord = await DiscordService.findById(id);
    if (!discord) throw new ApiError("discord is not existed.");
    const actors = discord.get("actors");
    if (actors.length > 0)
      throw new ApiError("discord is using by some models.");
    await DiscordService.deleteDiscord(id);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleAppendActor = async (req, res) => {
  try {
    const { id } = req.params;
    const { model } = req.body;
    // check if discord is valid
    const discord = await DiscordService.findById(id);
    if (!discord) throw new ApiError("discord is not existed.");
    // check if actor is valid
    const actor = await ActorService.findById(model)
    if (!actor) throw new ApiError("model is not existed.")
    // get old discord for actor
    const oldDiscord = actor.get("discord");
    if (oldDiscord) {
      if (oldDiscord == id) {
        throw new ApiError("discord already includes this model")
      } else {
        // remove actor from old discord
        await DiscordService.removeActor(oldDiscord, actor._id);
      }
    }
    // set discord for actor
    await ActorService.setDiscord(actor._id, id);
    // append actor to discord
    await DiscordService.appendActor(id, actor._id);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleRemoveActor = async (req, res) => {
  try {
    const { id } = req.params;
    const { model } = req.body;
    // check if discord is valid
    const discord = await DiscordService.findById(id);
    if (!discord)
      throw new ApiError("discord is not existed.");
    // check if actor is valid
    const actor = await ActorService.findById(model)
    if (!actor) throw new ApiError("model is not existed.");
    if (discord.get("actors").includes(actor._id)) {
      await DiscordService.removeActor(id, model);
      await ActorService.clearDiscord(actor._id);
    }
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};
const DiscordCtrl = {
  handleLoadDiscords,
  handleCreateDiscord,
  handleDeleteDiscord,
  handleUpdateDiscord,
  handleAppendActor,
  handleRemoveActor,
};

module.exports = DiscordCtrl;
