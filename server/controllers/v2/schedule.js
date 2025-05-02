const ScheduleService2 = require("../../services/v2/schedule");
const { isModelOwner } = require("../../utils/helper");
const { sendError, sendResult, ApiError } = require("../../utils/resp");

const handleLoadSchedulesForAgency = async (req, res) => {
  try {
    const { platform, page, status } = req.query;
    const [schedules, schedulesCount] = await ScheduleService2.loadSchedulesWithPage({ platform, status, page: page || "1" })
    sendResult(res, { schedules, schedulesCount })
  } catch (error) {
    sendError(res, error)
  }
}

const handleCreateScheduleForAgency = async (req, res) => {
  try {
    const params = req.body;
    await ScheduleService2.createSchedule(req.manager._id, params);
    sendResult(res)
  } catch (error) {
    sendError(res, error)
  }
}

const handleUpdateScheduleForAgency = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { action, ...params } = req.body;
    const schedule = await ScheduleService2.getSchedule(scheduleId);
    if (!schedule)
      throw new ApiError("Scheduled post does not exist");
    switch (action) {
      case "change":
        await ScheduleService2.changeSchedule(scheduleId, params);
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
    sendResult(res)
  } catch (error) {
    sendError(res, error)
  }
}

const ScheduleCtrl2 = {
  handleLoadSchedulesForAgency,
  handleCreateScheduleForAgency,
  handleUpdateScheduleForAgency,
  handleDeleteScheduleForAgency
};

module.exports = ScheduleCtrl2;