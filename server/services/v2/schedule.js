const { ScheduleStatus } = require("../../config/const");
const ScheduleModel = require("../../models/schedule")

const createSchedule = (agencyId, { platform, account, media, preview, title, folder, tags, type, price, fanPrice, scheduledAt }) =>
  ScheduleModel.create({
    owner: agencyId,
    platform,
    account,
    media,
    preview,
    title,
    folder,
    tags,
    type,
    price,
    fanPrice,
    scheduledAt,
  })

const loadSchedulesWithPage = ({ platform, status, page }) => {
  const platformQuery = platform && platform != "" ? { platform } : {};
  const statusQuery = status && status != "" ? { status: parseInt(status) } : {};
  const query = {
    ...platformQuery,
    ...statusQuery,
  }
  return Promise.all([
    ScheduleModel
      .find(query)
      .sort("scheduledAt")
      .skip((parseInt(page) - 1) * 10)
      .limit(10)
      .populate("owner", "name")
      .populate({
        path: "account",
        select: "actor number alias",
        populate: {
          path: "actor",
          select: "number name"
        }
      }),
    ScheduleModel.countDocuments()
  ]);
}

const getSchedule = (scheduleId) =>
  ScheduleModel.findById(scheduleId);

const deleteSchedule = (scheduleId) =>
  ScheduleModel.findByIdAndDelete(scheduleId);

const changeSchedule = (scheduleId, { media, preview, title, folder, tags, type, price, fanPrice, scheduledAt }) =>
  ScheduleModel.findByIdAndUpdate(scheduleId, {
    $set: {
      media,
      preview,
      title,
      folder,
      tags,
      type,
      price,
      fanPrice,
      scheduledAt,
      status: ScheduleStatus.WAITING,
    }
  }
  )

const ScheduleService2 = {
  getSchedule,
  deleteSchedule,
  createSchedule,
  changeSchedule,
  loadSchedulesWithPage,
}

module.exports = ScheduleService2