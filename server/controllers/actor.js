const { AdminRole } = require("../config/const");
const AccountService = require("../services/account");
const ActorService = require("../services/actor");
const NotifyUtils = require("../utils/notifiy");
const { sendResult, sendError, ApiError } = require("../utils/resp");

const handleLoadActors = async (req, res) => {
  try {
    const { page, pageSize } = req.query
    const [actors, actorsCount] = await ActorService.loadActors(req.manager, { page, pageSize: pageSize || "10" });
    sendResult(res, { actors, actorsCount });
  } catch (error) {
    sendError(res, error);
  }
};

const handleLoadAllModels = async (req, res) => {
  try {
    const actors = await ActorService.loadAllActors(req.manager);
    sendResult(res, { actors });
  } catch (error) {
    sendError(res, error);
  }
};

const handleCreateActor = async (req, res) => {
  try {
    const { number, name, ...params } = req.body;
    const agency = req.manager;

    // check agency limit
    const count = await ActorService.getActorCount(agency._id);
    if (agency.role == AdminRole.AGENCY && count >= agency.maxActors)
      throw new ApiError(`Model amount is limited by website`);

    // check if model name is duplicated
    let actor = await ActorService.findByName(name);
    if (actor) throw new ApiError(`The model name(${name}) is already existed.`);

    // check if model number is duplicated
    actor = await ActorService.findByNumber(req.manager._id, number);
    if (actor)
      throw new ApiError(`The model number(${number}) is already existed.`);

    // create model
    actor = await ActorService.createActor({ number, name, owner: agency._id, ...params });

     // send notification to discord
    await NotifyUtils.sendMessage(`AGENCY : ${agency.name}`, `MODEL : ${number}. ${name}`, `create model`);

    sendResult(res);
  } catch (error) {
    console.error(error)
    sendError(res, error);
  }
};

const handleDeleteActor = async (req, res) => {
  try {
    const { actorId } = req.params;
    const actor = await ActorService.findById(actorId);
    if (!actor)
      throw new ApiError("The model does not exist.")
    if (req.manager.role != AdminRole.MANAGER && actor.owner.toString() != req.manager._id.toString())
      throw new ApiError(`The model is able to delete only by owner.`)
    const accounts = actor.get("accounts");
    if (accounts.length > 0)
      throw new ApiError(
        `The model(${actor.get("number")}, ${actor.get(
          "name"
        )}) still have some accounts.`
      );
    await ActorService.deleteActor(actorId);
    await NotifyUtils.sendMessage(`AGENCY : ${req.manager.name})`, `MODEL : ${actor.number}. ${actor.name}`, `delete model`);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleUpdateActor = async (req, res) => {
  try {
    const { actorId } = req.params;
    const { number, name, ...params } = req.body;
    let actor = await ActorService.findByName(name);
    if (actor && actor._id != actorId)
      throw new ApiError(`The model name(${name}) is already existed.`);
    actor = await ActorService.findByNumber(req.manager._id, number);
    if (actor && actor._id != actorId)
      throw new ApiError(`The model number(${name}) is already existed.`);
    actor = await ActorService.findById(actorId);
    if (req.manager.role != AdminRole.MANAGER && actor.owner.toString() != req.manager._id.toString())
      throw new ApiError(`The model is able to update only by owner.`)
    await ActorService.updateActor(actorId, { number, name, ...params });
    await AccountService.updateNumber(actorId, number);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleUpdateProfile = async (req, res) => {
  try {
    const { actorId } = req.params;
    const params = req.body;
    const actor = await ActorService.findById(actorId);
    if (!actor)
      throw new ApiError(`The model does not exist.`);
    if (req.manager.role != AdminRole.MANAGER && actor.owner.toString() != req.manager._id.toString())
      throw new ApiError(`The model is able to update only by owner.`)
    await ActorService.updateProfile(actorId, params);
    await AccountService.updateParamsForActor(actorId, { "params.profileUpdated": true });
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleChangeAgency = async (req, res) => {
  try {
    const { actorId } = req.params;
    const { agency } = req.body;
    const actor = await ActorService.findById(actorId);
    if (!actor)
      throw new ApiError(`The model does not exist.`);
    if (req.manager.role != AdminRole.MANAGER)
      throw new ApiError(`The model's owner is able to change only by admin.`)
    await ActorService.changeAgency(actorId, agency)
    await AccountService.changeAgency(actorId, agency);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleGetContent = async (req, res) => {
  try {
    const { actorId } = req.params;
    let actor = await ActorService.findById(actorId);
    if (!actor)
      throw new ApiError(`model does not exist.`);
    sendResult(res, { actor });
  } catch (error) {
    sendError(res, error);
  }
}

const handleAppendContent = async (req, res) => {
  try {
    const { actorId } = req.params;
    const params = req.body;
    let actor = await ActorService.findById(actorId);
    if (!actor)
      throw new ApiError(`The model does not exist.`);
    if (req.manager.role != AdminRole.MANAGER && actor.owner.toString() != req.manager._id.toString())
      throw new ApiError(`The model content is able to update only by owner.`)
    await ActorService.appendContent(actorId, params);
    sendResult(res, { actor });
  } catch (error) {
    sendError(res, error);
  }
}

const handleUpdateContent = async (req, res) => {
  try {
    const { actorId, contentId } = req.params;
    const params = req.body;
    let actor = await ActorService.findById(actorId, contentId);
    if (!actor)
      throw new ApiError(`The model does not exist.`);
    if (req.manager.role != AdminRole.MANAGER && actor.owner.toString() != req.manager._id.toString())
      throw new ApiError(`The model content is able to update only by owner.`)
    await ActorService.updateContent(actorId, contentId, params);
    sendResult(res, { actor });
  } catch (error) {
    sendError(res, error);
  }
}

const handleDeleteContent = async (req, res) => {
  try {
    const { actorId, contentId } = req.params;
    await ActorService.deleteContent(actorId, contentId);
    let actor = await ActorService.findById(actorId);
    if (!actor)
      throw new ApiError(`The model does not exist.`);
    if (req.manager.role != AdminRole.MANAGER && actor.owner.toString() != req.manager._id.toString())
      throw new ApiError(`The model is able to delete only by owner`)
    sendResult(res, { actor });
  } catch (error) {
    sendError(res, error);
  }
}

const handleClearContents = async (req, res) => {
  try {
    const { actorId } = req.params;
    let actor = await ActorService.findById(actorId);
    if (!actor)
      throw new ApiError(`model does not exist.`);
    if (req.manager.role != AdminRole.MANAGER && actor.owner.toString() != req.manager._id.toString())
      throw new ApiError(`The model is able to delete only by owner`)
    await ActorService.clearContents(actorId);
    sendResult(res, { actor });
  } catch (error) {
    sendError(res, error);
  }
}

const handleSyncContents = async (req, res) => {
  try {
    const { actorId } = req.params;
    let actor = await ActorService.findById(actorId);
    if (!actor)
      throw new ApiError(`The model does not exist.`);
    await AccountService.syncContents(actorId);
    await ActorService.syncContents(actorId);
    actor = await ActorService.findById(actorId);
    await NotifyUtils.sendMessage(`AGENCY : ${req.manager.name})`, `MODEL : ${actor.number}. ${actor.name}`, `update contents`);
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
  handleSyncContents,
  handleUpdateProfile,
  handleChangeAgency,
};

module.exports = ActorCtrl;
