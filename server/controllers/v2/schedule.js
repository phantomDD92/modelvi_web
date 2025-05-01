const ScheduleService2 = require("../../services/v2/schedule");
const { sendError } = require("../../utils/resp");

const handleLoadSchedulesForAgency = async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const [schedules, schedulesCount] = await ScheduleService2.loadSchedulesWithPage({ page: page || "1", pageSize: pageSize || "10" })
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

const ScheduleCtrl2 = {
  handleLoadSchedulesForAgency,
  handleCreateScheduleForAgency
};

module.exports = ScheduleCtrl2;