const { AdminRole } = require("../config/const");
const AccountService = require("../services/account");
const ActorService = require("../services/actor");
const { sendResult, sendError, ApiError } = require("../utils/resp");

const handleLoadActors = async (req, res) => {
  try {
    const { page, pageSize } = req.query
    const [actors, actorsCount] = await ActorService.loadActors({ page, pageSize: pageSize || "10" });
    sendResult(res, { actors, actorsCount });
  } catch (error) {
    sendError(res, error);
  }
};

const handleLoadAllModels = async (req, res) => {
  try {
    const actors = await ActorService.loadAllActors();
    sendResult(res, { actors });
  } catch (error) {
    sendError(res, error);
  }
};

const handleCreateActor = async (req, res) => {
  try {
    const { number, name, ...params } = req.body;
    const agency = req.manager;
    const count = await ActorService.getActorCount(agency._id);
    if (agency.role == AdminRole.AGENCY && count >= agency.maxActors)
      throw new ApiError(`Model amount is limited by website`);
    let actor = await ActorService.findByName(name);
    if (actor) throw new ApiError(`The model name(${name}) is already existed.`);
    actor = await ActorService.findByNumber(number);
    if (actor)
      throw new ApiError(`The model number(${number}) is already existed.`);
    await ActorService.createActor({ number, name, owner: agency._id, ...params });
    sendResult(res);
  } catch (error) {
    console.error(error)
    sendError(res, error);
  }
};

const handleDeleteActor = async (req, res) => {
  try {
    const { id } = req.body;
    const actor = await ActorService.findById(id);
    if (!actor)
      throw new ApiError("The model is not existed.")
    if (req.manager.role != AdminRole.MANAGER && actor.owner.toString() != req.manager._id.toString())
      throw new ApiError(`The model is able to delete only by owner.`)
    const accounts = actor.get("accounts");
    if (accounts.length > 0)
      throw new ApiError(
        `The model(${actor.get("number")}, ${actor.get(
          "name"
        )}) still have some accounts.`
      );
    await ActorService.deleteActor(id);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleUpdateActor = async (req, res) => {
  try {
    const { id, number, name, ...params } = req.body;
    let actor = await ActorService.findByName(name);
    if (actor && actor._id != id)
      throw new ApiError(`The model name(${name}) is already existed.`);
    actor = await ActorService.findByNumber(number);
    if (actor && actor._id != id)
      throw new ApiError(`The model number(${name}) is already existed.`);
    actor = await ActorService.findById(id);
    if (req.manager.role != AdminRole.MANAGER && actor.owner.toString() != req.manager._id.toString())
      throw new ApiError(`The model is able to update only by owner.`)
    await ActorService.updateActor(id, { number, name, owner: req.manager._id, ...params });
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleGetContent = async (req, res) => {
  try {
    const { id } = req.params;
    let actor = await ActorService.findById(id);
    if (!actor)
      throw new ApiError(`model is not existed.`);
    sendResult(res, { actor });
  } catch (error) {
    sendError(res, error);
  }
}

const handleAppendContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { filename } = req.file;
    const { folder, title, tags } = req.body;
    let actor = await ActorService.findById(id);
    if (!actor)
      throw new ApiError(`The model is not existed.`);
    if (req.manager.role != AdminRole.MANAGER && actor.owner.toString() != req.manager._id.toString())
      throw new ApiError(`The model content is able to update only by owner.`)
    await ActorService.appendContent(id, { image: filename, folder, title, tags });
    sendResult(res, { actor });
  } catch (error) {
    sendError(res, error);
  }
}

const handleUpdateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { contentId, folder, title, tags } = req.body;
    let actor = await ActorService.findById(id);
    if (!actor)
      throw new ApiError(`The model is not existed.`);
    if (req.manager.role != AdminRole.MANAGER && actor.owner.toString() != req.manager._id.toString())
      throw new ApiError(`The model content is able to update only by owner.`)
    await ActorService.updateContent(id, contentId, { folder, title, tags });
    sendResult(res, { actor });
  } catch (error) {
    sendError(res, error);
  }
}
const handleDeleteContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    await ActorService.deleteContent(id, content);
    let actor = await ActorService.findById(id);
    if (!actor)
      throw new ApiError(`The model is not existed.`);
    if (req.manager.role != AdminRole.MANAGER && actor.owner.toString() != req.manager._id.toString())
      throw new ApiError(`The model is able to delete only by owner`)
    sendResult(res, { actor });
  } catch (error) {
    sendError(res, error);
  }
}

const handleClearContents = async (req, res) => {
  try {
    const { id } = req.params;
    let actor = await ActorService.findById(id);
    if (!actor)
      throw new ApiError(`model is not existed.`);
    if (req.manager.role != AdminRole.MANAGER && actor.owner.toString() != req.manager._id.toString())
      throw new ApiError(`The model is able to delete only by owner`)
    await ActorService.clearContents(id);
    sendResult(res, { actor });
  } catch (error) {
    sendError(res, error);
  }
}

const handleSyncContents = async (req, res) => {
  try {
    const { id } = req.params;
    let actor = await ActorService.findById(id);
    if (!actor)
      throw new ApiError(`model is not existed.`);
    await AccountService.syncContents(actor._id);
    await ActorService.syncContents(actor._id);
    actor = await ActorService.findById(id);
    sendResult(res, { actor });
  } catch (error) {
    sendError(res, error);
  }
}

const ActorCtrl = {
  handleLoadAllModels,
  handleLoadActors,
  handleCreateActor,
  handleDeleteActor,
  handleUpdateActor,
  handleGetContent,
  handleAppendContent,
  handleUpdateContent,
  handleDeleteContent,
  handleClearContents,
  handleSyncContents
};

module.exports = ActorCtrl;
