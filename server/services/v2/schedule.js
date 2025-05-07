const { ScheduleStatus } = require("../../config/const");
const ScheduleModel = require("../../models/schedule");
const ScheduleResultModel = require("../../models/scheduleResult");

const createSchedule = (agencyId, modelId, { media, preview, title, folder, tags, type, price, scheduledAt }) =>
  ScheduleModel.create({
    owner: agencyId,
    actor: modelId,
    media,
    preview,
    title,
    folder,
    tags,
    type,
    price,
    scheduledAt,
  })

const loadSchedulesWithPage = ({ agency, model }, page) => {
  const agencyQuery = agency && agency != "" ? { owner: agency } : {};
  const modelQuery = model && model != "" ? { actor: model } : {};
  const query = {
    ...agencyQuery,
    ...modelQuery,
  }
  return Promise.all([
    ScheduleModel
      .find(query)
      .sort("scheduledAt")
      .skip((parseInt(page) - 1) * 10)
      .limit(10)
      .populate("owner", "name")
      .populate("actor", "number name")
      .populate({
        path: "results",
        select: "account status",
        populate: {
          path: "account",
          select: "platform number name"
        }
      }),
    ScheduleModel.countDocuments()
  ]);
}

const loadAgencySchedulesWithPage = (agencyId, { model }, page) => {
  const agencyQuery = { owner: agencyId }
  const modelQuery = model && model != "" ? { actor: model } : {};
  const query = {
    ...agencyQuery,
    ...modelQuery,
  }
  return Promise.all([
    ScheduleModel
      .find(query)
      .sort("scheduledAt")
      .skip((parseInt(page) - 1) * 10)
      .limit(10)
      .populate("owner", "name")
      .populate("actor", "number name")
      .populate({
        path: "results",
        select: "account status",
        populate: {
          path: "account",
          select: "platform number name"
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

const updateScheduleResults = (results) => {
  const updates = results.map(({ id, status, post, reason }) => ({
    updateOne: {
      filter: { _id: id },
      update: { $set: { status, post, reason } }
    }
  }));
  return ScheduleModel.bulkWrite(updates);
}

const loadLivingSchedules = (accountId) =>
  ScheduleResultModel.find({ account: accountId, status: { $lte: ScheduleStatus.SCHEDULED } })
    .populate("schedule", "media preview folder title tags type price scheduledAt");

const createScheduleResults = (scheduleId, accountIds) =>
  ScheduleResultModel.bulkWrite(accountIds.map(accountId => ({
    insertOne: {
      document: {
        schedule: scheduleId,
        account: accountId,
      }
    }
  })));

const setScheduleResults = (scheduleId, results) =>
  ScheduleModel.findByIdAndUpdate(scheduleId, { $set: { results } });

const deleteScheduleResults = (scheduleId) =>
  ScheduleResultModel.deleteMany({ schedule: scheduleId });

const ScheduleService2 = {
  getSchedule,
  deleteSchedule,
  createSchedule,
  changeSchedule,
  updateScheduleResults,
  loadSchedulesWithPage,
  loadAgencySchedulesWithPage,
  loadLivingSchedules,
  createScheduleResults,
  setScheduleResults,
  deleteScheduleResults,
}

module.exports = ScheduleService2