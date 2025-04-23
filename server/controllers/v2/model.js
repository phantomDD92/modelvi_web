const AccountService2 = require("../../services/v2/account");
const AgencyService2 = require("../../services/v2/agency");
const ModelService2 = require("../../services/v2/model");
const { isModelOwner } = require("../../utils/helper");
const NotifyUtils = require("../../utils/notifiy");
const { sendError, sendResult, ApiError } = require("../../utils/resp");

const handleLoadModelsForAdmin = async (req, res) => {
  try {
    const { search, agency } = req.query;
    const models = await ModelService2.loadModels({ search, agency });
    sendResult(res, { models });
  } catch (error) {
    console.error(error);
    sendError(res, error)
  }
}

const handleCreateModelForAdmin = async (req, res) => {
  try {
    const { agency: agencyId, number, name } = req.body;
    const agency = await AgencyService2.findAgencyById(agencyId);
    if (!agency)
      throw new ApiError("Agency does not exist.");
    // check if model name is duplicated
    let model = await ModelService2.findModelByName(agencyId, name);
    if (model) throw new ApiError(`Model Name(${name}) already exists.`);
    // check if model number is duplicated
    model = await ModelService2.findModelByNumber(agencyId, number);
    if (model)
      throw new ApiError(`Model number(${number}) is already existed.`);
    // create model
    model = await ModelService2.createModel({ number, name, owner: agencyId });
    // send notification to discord
    NotifyUtils.sendMessage(
      `${req.manager?.name} (Admin)`,
      `${agency.name} - ${number}. ${name}`,
      `CREATE MODEL`);
    sendResult(res);
  } catch (error) {
    console.error(error)
    sendError(res, error);
  }
};

const handleDeleteModelForAdmin = async (req, res) => {
  try {
    const { modelId } = req.params;
    const model = await ModelService2.findModelById(modelId);
    if (!model)
      throw new ApiError("Model does not exist.")
    const accounts = model.get("accounts");
    if (accounts.length > 0)
      throw new ApiError(
        `Model(${model.get("number")}, ${model.get("name")}) still have some accounts.`
      );
    await ModelService2.deleteModel(modelId);
    NotifyUtils.sendMessage(
      `${req.manager?.name} (Admin)`,
      `${model.owner.name} - ${model.number}. ${model.name}`,
      `DELETE A MODEL`);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleDeleteModelsForAdmin = async (req, res) => {
  try {
    const { modelIds } = req.body;
    const models = await ModelService2.findEmptyModels(modelIds)
    const emptyModelIds = models.map(model => model._id);
    await ModelService2.deleteModels(emptyModelIds);
    NotifyUtils.sendMessage(
      `${req.manager?.name} (Admin)`,
      `${models.map(model => `${model.owner?.name} - ${model.number}. ${model.name}`).join("\n")}`,
      `DELETE ${models.length} MODELS`);
    sendResult(res);
  } catch (error) {
    console.error(error);
    sendError(res, error);
  }
}

const handleLoadModelsForAgency = async (req, res) => {
  try {
    const { search } = req.query;
    const models = await ModelService2.loadAgencyModels(req.manager._id, search);
    sendResult(res, { models });
  } catch (error) {
    console.error(error);
    sendError(res, error)
  }
}

const handleCreateModelForAgency = async (req, res) => {
  try {
    const { number, name, ...params } = req.body;
    // check if model name is duplicated
    let model = await ModelService2.findModelByName(req.manager._id, name);
    if (model) throw new ApiError(`Model Name(${name}) already exists.`);
    // check if model number is duplicated
    model = await ModelService2.findModelByNumber(req.manager._id, number);
    if (model)
      throw new ApiError(`Model number(${number}) is already existed.`);
    // create model
    model = await ModelService2.createModel({ number, name, owner: req.manager._id });
    // send notification to discord
    NotifyUtils.sendMessage(
      `${req.manager?.name}`,
      `${req.manager?.name} - ${number}. ${name}`,
      `CREATE MODEL`);
    sendResult(res);
  } catch (error) {
    console.error(error)
    sendError(res, error);
  }
};

const handleDeleteModelForAgency = async (req, res) => {
  try {
    const { modelId } = req.params;
    const model = await ModelService2.findModelById(modelId);
    if (!model)
      throw new ApiError("Model does not exist.")
    if (model.owner?._id?.toString() != req.manager._id.toString())
      throw new ApiError(`Model is able to delete only by owner.`)
    const accounts = model.get("accounts");
    if (accounts.length > 0)
      throw new ApiError(
        `Model(${model.get("number")}, ${model.get("name")}) still have some accounts.`
      );
    await ModelService2.deleteModel(modelId);
    NotifyUtils.sendMessage(
      `${req.manager?.name}`,
      `${model.owner?.name} - ${model.number}. ${model.name}`,
      `DELETE A MODEL`);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleDeleteModelsForAgency = async (req, res) => {
  try {
    const { modelIds } = req.body;
    const models = await ModelService2.findEmptyModels(modelIds, req.manager._id)
    const emptyModelIds = models.map(model => model._id);
    await ModelService2.deleteModels(emptyModelIds);
    NotifyUtils.sendMessage(
      `${req.manager?.name}`,
      `${models.map(model => `${model.owner?.name} - ${model.number}. ${model.name}`).join("\n")}`,
      `DELETE ${models.length} MODELS`);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
}

const handleUpdateModelForAgency = async (req, res) => {
  try {
    const { modelId } = req.params;
    const { action, ...params } = req.body;
    let model = await ModelService2.findModelById(modelId);
    if (!model)
      throw new ApiError("Model does not exist.");
    if (model.owner?._id?.toString() != req.manager._id.toString())
      throw new ApiError(`Model can be updated only by owner.`)
    switch (action) {
      case "change":
        const { number, name } = params;
        let dup = await ModelService2.findModelByName(req.manager._id, name);
        if (dup && dup._id != modelId)
          throw new ApiError(`Model name(${name}) already exists.`);
        dup = await ModelService2.findModelByNumber(req.manager._id, number);
        if (dup && dup._id != modelId)
          throw new ApiError(`Model number(${name}) already exists.`);
        await ModelService2.changeModel(modelId, { number, name });
        await AccountService2.changeModelNumber(modelId, number);
        break;
      case "sync":
        await AccountService2.syncContents(modelId);
        await ModelService2.syncContents(modelId);
        NotifyUtils.sendMessage(
          `${req.manager?.name}`,
          `${model.owner?.name} - ${model.number}. ${model.name}`,
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

const handleUpdateModelForAdmin = async (req, res) => {
  try {
    const { modelId } = req.params;
    const { action, ...params } = req.body;
    let model = await ModelService2.findModelById(modelId);
    if (!model)
      throw new ApiError("Model does not exist.");
    switch (action) {
      case "change":
        const { agency: agencyId, number, name } = params;
        let dup = await ModelService2.findModelByName(model.owner._id, name);
        if (dup && dup._id != modelId)
          throw new ApiError(`Model name(${name}) already exists.`);
        dup = await ModelService2.findModelByNumber(model.owner._id, number);
        if (dup && dup._id != modelId)
          throw new ApiError(`Model number(${name}) already exists.`);
        await ModelService2.changeModel(modelId, { number, name });
        await AccountService2.changeModelNumber(modelId, number);
        await ModelService2.changeOwner(modelId, agencyId)
        await AccountService2.changeOwner(modelId, agencyId);
        break;
      case "sync":
        await AccountService2.syncContents(modelId);
        await ModelService2.syncContents(modelId);
        NotifyUtils.sendMessage(
          `${req.manager?.name} (Admin)`,
          `${model.owner?.name} - ${model.number}. ${model.name}`,
          `UPDATE A MODEL'S CONTENT`);
        break;
      default:
        throw new ApiError("Invalid model admin operation");
    }
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleUpdateModelsForAdmin = async (req, res) => {
  try {
    const { action, modelIds, ...params } = req.body;
    switch (action) {
      case "sync":
        const models = await ModelService2.findModelsByIds(modelIds);
        await ModelService2.syncBulkContents(modelIds);
        await AccountService2.syncBulkContents(modelIds)
        NotifyUtils.sendMessage(
          `${req.manager?.name} (Admin)`,
          `${models.map(model => `${model.owner?.name} - ${model.number}. ${model.name}`).join("\n")}`,
          `UPDATE ${models.length} MODELS' CONTENTS`);
        break;
      default:
        throw new ApiError("Invalid model admin operation");
    }
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleUpdateModelsForAgency = async (req, res) => {
  try {
    const { action, modelIs, ...params } = req.body;
    switch (action) {
      case "sync":
        const models = await ModelService2.findModelsByIds(modelIs, req.manager._id);
        const realModelIds = models.map(model => model._id);
        await ModelService2.syncBulkContents(realModelIds);
        await AccountService2.syncBulkContents(realModelIds);
        NotifyUtils.sendMessage(
          `${req.manager?.name}`,
          `${models.map(model => `${model.owner?.name} - ${model.number}. ${model.name}`).join("\n")}`,
          `UPDATE ${models.length} MODELS' CONTENTS`);
        break;
      default:
        throw new ApiError("Invalid model operation");
    }
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleGetContentsForAdmin = async (req, res) => {
  try {
    const { modelId } = req.params;
    const model = await ModelService2.getModelWithContents(modelId);
    if (!model)
      throw new ApiError(`Model does not exist.`);
    sendResult(res, { model });
  } catch (error) {
    sendError(res, error);
  }
}

const handleGetContentsForAgency = async (req, res) => {
  try {
    const { modelId } = req.params;
    const model = await ModelService2.getModelWithContents(modelId);
    if (!model)
      throw new ApiError(`Model does not exist.`);
    if (!isModelOwner(model, req.manager))
      throw new ApiError(`Model contents can be accessible by owner`);
    sendResult(res, { model });
  } catch (error) {
    sendError(res, error);
  }
}

const handleAppendContentForAdmin = async (req, res) => {
  try {
    const { modelId } = req.params;
    const params = req.body;
    let model = await ModelService2.getModel(modelId);
    if (!model)
      throw new ApiError(`The model does not exist.`);
    await ModelService2.appendContent(modelId, params);
    model = await ModelService2.getModelWithContents(modelId);
    sendResult(res, { model });
  } catch (error) {
    sendError(res, error);
  }
}

const handleAppendContentForAgency = async (req, res) => {
  try {
    const { modelId } = req.params;
    const params = req.body;
    let model = await ModelService2.getModel(modelId);
    if (!model)
      throw new ApiError(`The model does not exist.`);
    if (!isModelOwner(model, req.manager))
      throw new ApiError(`Model contents can be accessible by owner`);
    await ModelService2.appendContent(modelId, params);
    model = await ModelService2.getModelWithContents(modelId);
    sendResult(res, { model });
  } catch (error) {
    sendError(res, error);
  }
}

const handleUpdateContentForAgency = async (req, res) => {
  try {
    const { modelId, contentId } = req.params;
    const { action, ...params } = req.body;
    let model = await ModelService2.getModel(modelId);
    if (!model)
      throw new ApiError(`Model does not exist.`);
    if (!isModelOwner(model, req.manager))
      throw new ApiError(`Model contents can be accessible by owner`);
    switch (action) {
      case "change":
        await ModelService2.updateContent(modelId, contentId, params);
        break;
      default:
        throw new ApiError("Invalid content operations")
    }
    model = await ModelService2.getModelWithContents(modelId);
    sendResult(res, { model });
  } catch (error) {
    sendError(res, error);
  }
}

const handleUpdateContentForAdmin = async (req, res) => {
  try {
    const { modelId, contentId } = req.params;
    const { action, ...params } = req.body;
    let model = await ModelService2.getModel(modelId);
    if (!model)
      throw new ApiError(`Model does not exist.`);
    switch (action) {
      case "change":
        await ModelService2.updateContent(modelId, contentId, params);
        break;
      default:
        throw new ApiError("Invalid content operations")
    }
    model = await ModelService2.getModelWithContents(modelId);
    sendResult(res, { model });
  } catch (error) {
    sendError(res, error);
  }
}

const handleDeleteContentForAgency = async (req, res) => {
  try {
    const { modelId, contentId } = req.params;
    let model = await ModelService2.getModel(modelId);
    if (!model)
      throw new ApiError(`Model does not exist.`);
    if (!isModelOwner(model, req.manager))
      throw new ApiError(`Model contents can be accessible by owner`);
    await ModelService2.deleteContent(modelId, contentId);
    model = await ModelService2.getModelWithContents(modelId);
    sendResult(res, { model });
  } catch (error) {
    sendError(res, error);
  }
}

const handleDeleteContentForAdmin = async (req, res) => {
  try {
    const { modelId, contentId } = req.params;
    let model = await ModelService2.getModel(modelId);
    if (!model)
      throw new ApiError(`Model does not exist.`);
    await ModelService2.deleteContent(modelId, contentId);
    model = await ModelService2.getModelWithContents(modelId);
    sendResult(res, { model });
  } catch (error) {
    sendError(res, error);
  }
}

const handleDeleteContentsForAgency = async (req, res) => {
  try {
    const { modelId } = req.params;
    let model = await ModelService2.getModel(modelId);
    if (!model)
      throw new ApiError(`Model does not exist.`);
    if (!isModelOwner(model, req.manager))
      throw new ApiError(`Model contents can be accessible by owner`);
    const { contentIds } = req.body;
    await ModelService2.deleteContents(modelId, contentIds);
    model = await ModelService2.getModelWithContents(modelId);
    sendResult(res, { model });
  } catch (error) {
    sendError(res, error);
  }
}

const handleDeleteContentsForAdmin = async (req, res) => {
  try {
    const { modelId } = req.params;
    let model = await ModelService2.getModel(modelId);
    if (!model)
      throw new ApiError(`Model does not exist.`);
    const { contentIds } = req.body;
    await ModelService2.deleteContents(modelId, contentIds);
    model = await ModelService2.getModelWithContents(modelId);
    sendResult(res, { model });
  } catch (error) {
    sendError(res, error);
  }
}

const handleUpdateContentsForAgency = async (req, res) => {
  try {
    const { modelId } = req.params;
    let model = await ModelService2.getModel(modelId);
    if (!model)
      throw new ApiError(`Model does not exist.`);
    if (!isModelOwner(model, req.manager))
      throw new ApiError(`Model contents can be accessible by owner`);
    const { action, contentIds, ...params } = req.body;
    switch (action) {
      case "platform":
        await ModelService2.updateContentsPlatform(modelId, contentIds, params);
        break;
      case "clear":
        await ModelService2.clearContents(modelId);
        break;
      default:
        throw new ApiError("Invalid content operation");
    }
    model = await ModelService2.getModelWithContents(modelId);
    sendResult(res, { model });
  } catch (error) {
    sendError(res, error);
  }
}

const handleUpdateContentsForAdmin = async (req, res) => {
  try {
    const { modelId } = req.params;
    let model = await ModelService2.getModel(modelId);
    if (!model)
      throw new ApiError(`Model does not exist.`);
    const { action, contentIds, ...params } = req.body;
    switch (action) {
      case "platform":
        await ModelService2.updateContentsPlatform(modelId, contentIds, params);
        break;
      case "clear":
        await ModelService2.clearContents(modelId);
        break;
      default:
        throw new ApiError("Invalid content operation");
    }
    model = await ModelService2.getModelWithContents(modelId);
    sendResult(res, { model });
  } catch (error) {
    sendError(res, error);
  }
}

const ModelCtrl2 = {
  handleLoadModelsForAdmin,
  handleCreateModelForAdmin,
  handleDeleteModelForAdmin,
  handleDeleteModelsForAdmin,
  handleUpdateModelForAdmin,
  handleUpdateModelsForAdmin,
  handleGetContentsForAdmin,
  handleAppendContentForAdmin,
  handleDeleteContentForAdmin,
  handleDeleteContentsForAdmin,
  handleUpdateContentForAdmin,
  handleUpdateContentsForAdmin,


  handleLoadModelsForAgency,
  handleCreateModelForAgency,
  handleDeleteModelForAgency,
  handleDeleteModelsForAgency,
  handleUpdateModelForAgency,
  handleUpdateModelsForAgency,
  handleGetContentsForAgency,
  handleAppendContentForAgency,
  handleDeleteContentForAgency,
  handleDeleteContentsForAgency,
  handleUpdateContentForAgency,
  handleUpdateContentsForAgency,

};

module.exports = ModelCtrl2;