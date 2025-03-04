const { AdminRole } = require("../config/const");
const AccountService = require("../services/account");
const ActorService = require("../services/actor");
const NotifyUtils = require("../utils/notifiy");
const { sendResult, sendError, ApiError } = require("../utils/resp");

const handleLoadActors = async (req, res) => {
  try {
    const actors = await ActorService.loadActors(req.manager);
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
    await NotifyUtils.sendMessage(
      `${agency.name} (${agency.role == AdminRole.MANAGER ? "Admin" : "Agency"})`,
      `${number}. ${name}`,
      `CREATE MODEL`);

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
    await NotifyUtils.sendMessage(
      `${req.manager?.name} (${req.manager.role == AdminRole.MANAGER ? "Admin" : "Agency"})`,
      `${actor.number}. ${actor.name}`,
      `DELETE A MODEL`);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleDeleteActors = async (req, res) => {
  try {
    const { modelIds } = req.body;
    const emptyActors = await ActorService.getEmptyActors(req.manager, modelIds)
    const emptyActorIds = emptyActors.map(actor => actor._id);
    await ActorService.deleteActors(emptyActorIds);
    await NotifyUtils.sendMessage(
      `${req.manager?.name} (${req.manager.role == AdminRole.MANAGER ? "Admin" : "Agency"})`,
      `${emptyActors.map(actor => `${actor.number}. ${actor.name}`).join("\n")}`,
      `DELETE ${emptyActors.length} MODELS`);
    sendResult(res);
  } catch (error) {
    console.error(error);
    sendError(res, error);
  }
}

const handleUpdateActor = async (req, res) => {
  try {
    const { actorId } = req.params;
    const { action, ...params } = req.body;
    let actor = await ActorService.findById(actorId);
    if (!actor)
      throw new ApiError("Model does not exist.");
    switch (action) {
      case "change":
        const { number, name, ...others } = params;
        let dup = await ActorService.findByName(name);
        if (dup && dup._id != actorId)
          throw new ApiError(`Model name(${name}) is already existed.`);
        dup = await ActorService.findByNumber(req.manager._id, number);
        if (dup && dup._id != actorId)
          throw new ApiError(`Model number(${name}) is already existed.`);
        if (req.manager.role != AdminRole.MANAGER && actor.owner.toString() != req.manager._id.toString())
          throw new ApiError(`The model is able to update only by owner.`)
        await ActorService.changeActor(actorId, { number, name, ...others });
        await AccountService.updateNumber(actorId, number);
        break;
      case "agency":
        const { agency } = params;
        if (req.manager.role != AdminRole.MANAGER)
          throw new ApiError(`The model's owner is able to change only by admin.`)
        await ActorService.changeAgency(actorId, agency)
        await AccountService.changeAgency(actorId, agency);
        break;
      case "sync":
        await AccountService.syncContents(actorId);
        await ActorService.syncContents(actorId);
        await NotifyUtils.sendMessage(
          `${req.manager?.name} (${req.manager.role == AdminRole.MANAGER ? "Admin" : "Agency"})`,
          `${actor.number}. ${actor.name}`,
          `UPDATE A MODEL'S CONTENT`);
        break;
      default:
        throw new ApiError("Invalid model operation");
    }
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleUpdateActors = async (req, res) => {
  try {
    const { action, actorIds, ...params } = req.body;
    switch (action) {
      case "sync":
        throw new ApiError("Unimplemented model operation");
        break;
      default:
        throw new ApiError("Invalid model operation");
    }
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

// const handleUpdateProfile = async (req, res) => {
//   try {
//     const { actorId } = req.params;
//     const params = req.body;
//     const actor = await ActorService.findById(actorId);
//     if (!actor)
//       throw new ApiError(`The model does not exist.`);
//     if (req.manager.role != AdminRole.MANAGER && actor.owner.toString() != req.manager._id.toString())
//       throw new ApiError(`The model is able to update only by owner.`)
//     await ActorService.updateProfile(actorId, params);
//     await AccountService.updateParamsForActor(actorId, { "params.profileUpdated": true });
//     sendResult(res);
//   } catch (error) {
//     sendError(res, error);
//   }
// };

const handleGetContents = async (req, res) => {
  try {
    const { actorId } = req.params;
    let actor = await ActorService.findById(actorId);
    if (!actor)
      throw new ApiError(`Model does not exist.`);
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
    actor = await ActorService.findById(actorId);
    sendResult(res, { actor });
  } catch (error) {
    sendError(res, error);
  }
}

const handleUpdateContent = async (req, res) => {
  try {
    const { actorId, contentId } = req.params;
    const { action, ...params } = req.body;
    let actor = await ActorService.findById(actorId, contentId);
    if (!actor)
      throw new ApiError(`Model does not exist.`);
    if (req.manager.role != AdminRole.MANAGER && actor.owner.toString() != req.manager._id.toString())
      throw new ApiError(`Model content is able to update only by owner.`)
    switch (action) {
      case "change":
        await ActorService.updateContent(actorId, contentId, params);
        break;
      default:
        throw new ApiError("Invalid content operations")
    }
    actor = await ActorService.findById(actorId, contentId);
    sendResult(res, { actor });
  } catch (error) {
    sendError(res, error);
  }
}

const handleDeleteContent = async (req, res) => {
  try {
    const { actorId, contentId } = req.params;
    let actor = await ActorService.findById(actorId);
    if (!actor)
      throw new ApiError(`The model does not exist.`);
    if (req.manager.role != AdminRole.MANAGER && actor.owner.toString() != req.manager._id.toString())
      throw new ApiError(`The model is able to delete only by owner`)
    await ActorService.deleteContent(actorId, contentId);
    actor = await ActorService.findById(actorId);
    sendResult(res, { actor });
  } catch (error) {
    sendError(res, error);
  }
}

const handleDeleteContents = async (req, res) => {
  try {
    const { actorId } = req.params;
    let actor = await ActorService.findById(actorId);
    if (!actor)
      throw new ApiError(`Model does not exist.`);
    if (req.manager.role != AdminRole.MANAGER && actor.owner.toString() != req.manager._id.toString())
      throw new ApiError(`Model contents are able to delete only by owner`)
    const { contentIds } = req.body;
    await ActorService.deleteBulkContents(actorId, contentIds);
    actor = await ActorService.findById(actorId);
    sendResult(res, { actor });
  } catch (error) {
    sendError(res, error);
  }
}

const handleUpdateContents = async (req, res) => {
  try {
    const { actorId } = req.params;
    let actor = await ActorService.findById(actorId);
    if (!actor)
      throw new ApiError(`Model does not exist.`);
    const { action, contentIds, ...params } = req.body;
    switch (action) {
      case "platform":
        await ActorService.updateBulkContentsParams(actorId, contentIds, params);
        break;
      case "clear":
        await ActorService.clearContents(actorId);
        break;
      default:
        throw new ApiError("Invalid content action");
    }
    actor = await ActorService.findById(actorId);
    sendResult(res, { actor });
  } catch (error) {
    sendError(res, error);
  }
}

const ActorCtrl = {
  handleLoadActors,
  handleCreateActor,
  handleDeleteActor,
  handleUpdateActor,
  handleGetContents,
  handleAppendContent,
  handleUpdateContent,
  handleDeleteContent,
  handleDeleteContents,
  handleUpdateContents,
  handleDeleteActors,
  handleUpdateActors,
  // handleUpdateProfile,
  // handleChangeAgency,
};

module.exports = ActorCtrl;
