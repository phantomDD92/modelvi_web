const AccountService2 = require("../../services/v2/account");
const ModelService2 = require("../../services/v2/model");
const ScheduleService2 = require("../../services/v2/schedule");
const { isModelOwner } = require("../../utils/helper");
const { sendError, sendResult, ApiError } = require("../../utils/resp");

const handleLoadSchedulesForAgency = async (req, res) => {
  try {
    const { model, page } = req.query;
    const [schedules, schedulesCount] = await ScheduleService2.loadAgencySchedulesWithPage(req.manager._id, { model }, page || "1")
    sendResult(res, { schedules, schedulesCount })
  } catch (error) {
    sendError(res, error)
  }
}

const handleCreateScheduleForAgency = async (req, res) => {
  try {
    const { model: modelId, platforms, ...params } = req.body;
    const model = await ModelService2.getModel(modelId);
    if (!model)
      throw new ApiError("Model does not exist");
    if (!isModelOwner(model, req.manager))
      throw new ApiError("Schedule post can be accessed by model owner");
    const accounts = await AccountService2.getModelAccounts(modelId, platforms);
    if (accounts.length == 0)
      throw new ApiError("Model has no accounts");
    const schedule = await ScheduleService2.createSchedule(req.manager._id, modelId, params);
    const result = await ScheduleService2.createScheduleResults(schedule._id, accounts.map(account => account._id));
    await ScheduleService2.setScheduleResults(schedule._id, Object.values(result.insertedIds));
    sendResult(res)
  } catch (error) {
    sendError(res, error)
  }
}

const handleUpdateScheduleForAgency = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { action, model: modelId, platforms, ...params } = req.body;
    const schedule = await ScheduleService2.getSchedule(scheduleId);
    if (!schedule)
      throw new ApiError("Scheduled post does not exist");
    switch (action) {
      case "change":
        await ScheduleService2.deleteScheduleResults();
        await ScheduleService2.changeSchedule(scheduleId, params);
        const accounts = await AccountService2.getModelAccounts(modelId, platforms);
        const result = await ScheduleService2.createScheduleResults(schedule._id, accounts.map(account => account._id));
        await ScheduleService2.setScheduleResults(schedule._id, Object.values(result.insertedIds));
        break
      default:
        throw new ApiError("Invalid schedule operation")
    }
    sendResult(res)
  } catch (error) {
    sendError(res, error)
  }
}

const handleDeleteScheduleForAgency = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const schedule = await ScheduleService2.getSchedule(scheduleId);
    if (!schedule)
      throw new ApiError("Scheduled post does not exist");
    if (!isModelOwner(schedule, req.manager))
      throw new ApiError("Scheduled post can be accessed by creator");
    await ScheduleService2.deleteSchedule(scheduleId);
    await ScheduleService2.deleteScheduleResults(scheduleId);
    sendResult(res)
  } catch (error) {
    sendError(res, error)
  }
}

const handleLoadSchedulesForAdmin = async (req, res) => {
  try {
    const { agency, model, page } = req.query;
    const [schedules, schedulesCount] = await ScheduleService2.loadSchedulesWithPage({ agency, model }, page || "1")
    sendResult(res, { schedules, schedulesCount })
  } catch (error) {
    sendError(res, error)
  }
}

const handleCreateScheduleForAdmin = async (req, res) => {
  try {
    const { model: modelId, platforms, ...params } = req.body;
    const model = await ModelService2.getModel(modelId);
    if (!model)
      throw new ApiError("Model does not exist");
    const accounts = await AccountService2.getModelAccounts(modelId, platforms);
    if (accounts.length == 0)
      throw new ApiError("Model has no accounts");
    const schedule = await ScheduleService2.createSchedule(model.owner, modelId, params);
    const result = await ScheduleService2.createScheduleResults(schedule._id, accounts.map(account => account._id));
    console.log(result);
    await ScheduleService2.setScheduleResults(schedule._id, Object.values(result.insertedIds));
    sendResult(res)
  } catch (error) {
    sendError(res, error)
  }
}

const handleUpdateScheduleForAdmin = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { action, model: modelId, platforms, ...params } = req.body;
    const schedule = await ScheduleService2.getSchedule(scheduleId);
    if (!schedule)
      throw new ApiError("Scheduled post does not exist");
    switch (action) {
      case "change":
        await ScheduleService2.deleteScheduleResults();
        await ScheduleService2.changeSchedule(scheduleId, params);
        const accounts = await AccountService2.getModelAccounts(modelId, platforms);
        const result = await ScheduleService2.createScheduleResults(schedule._id, accounts.map(account => account._id));
        await ScheduleService2.setScheduleResults(schedule._id, Object.values(result.insertedIds));
        break
      default:
        throw new ApiError("Invalid schedule operation")
    }
    sendResult(res)
  } catch (error) {
    sendError(res, error)
  }
}

const handleDeleteScheduleForAdmin = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const schedule = await ScheduleService2.getSchedule(scheduleId);
    if (!schedule)
      throw new ApiError("Scheduled post does not exist");
    await ScheduleService2.deleteSchedule(scheduleId);
    await ScheduleService2.deleteScheduleResults(scheduleId);
    sendResult(res)
  } catch (error) {
    sendError(res, error)
  }
}


const ScheduleCtrl2 = {
  handleLoadSchedulesForAgency,
  handleCreateScheduleForAgency,
  handleUpdateScheduleForAgency,
  handleDeleteScheduleForAgency,

  handleLoadSchedulesForAdmin,
  handleCreateScheduleForAdmin,
  handleUpdateScheduleForAdmin,
  handleDeleteScheduleForAdmin
};

module.exports = ScheduleCtrl2;