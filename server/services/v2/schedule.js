const moment = require('moment');
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

const loadSchedulesWithPage = ({ agency, model, page, pageSize }) => {
  console.log("HERE");
  const timeQuery = { scheduledAt: { $gte: moment().subtract(7, "day").toDate() } }
  const agencyQuery = agency && agency != "" ? { owner: agency } : {};
  const modelQuery = model && model != "" ? { actor: model } : {};
  const query = {
    ...timeQuery,
    ...agencyQuery,
    ...modelQuery,
  }
  return Promise.all([
    ScheduleModel
      .find(query)
      .sort("scheduledAt")
      .skip((parseInt(page) - 1) * parseInt(pageSize))
      .limit(parseInt(pageSize))
      .lean()
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
    ScheduleModel.countDocuments(query)
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
    ScheduleModel.countDocuments(query)
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

const loadScheduleResultsWithPage = ({ agency, model, status, platform }, page, pageSize) => {
  const timeQuery = { scheduledAt: { $gte: moment().subtract(7, "day").toDate() } }
  const agencyQuery = agency && agency != "" ? { owner: agency } : {};
  const modelQuery = model && model != "" ? { actor: model } : {};
  const statusQuery = status && status != "" ? { status } : {};
  const platformQuery = platform && platform != "" ? { platform } : {};
  const query = {
    ...timeQuery,
    ...agencyQuery,
    ...modelQuery,
    ...statusQuery,
    ...platformQuery,
  }
  return Promise.all([
    ScheduleResultModel
      .find(query)
      .sort("scheduledAt")
      .skip((parseInt(page) - 1) * 10)
      .limit(parseInt(pageSize))
      .populate("owner", "name")
      .populate("actor", "number name")
      .populate("account", "platform alias")
      .populate("schedule"),
    ScheduleResultModel.countDocuments(query)
  ]);
}

const loadAgencyScheduleResultsWithPage = (agencyId, { model, status, platform }, page, pageSize) => {
  const timeQuery = { scheduledAt: { $gte: moment().subtract(7, "day").toDate() } }
  const modelQuery = model && model != "" ? { actor: model } : {};
  const statusQuery = status && status != "" ? { status } : {};
  const platformQuery = platform && platform != "" ? { platform } : {};
  const query = {
    owner: agencyId,
    ...timeQuery,
    ...modelQuery,
    ...statusQuery,
    ...platformQuery,
  }
  return Promise.all([
    ScheduleResultModel
      .find(query)
      .sort("scheduledAt")
      .skip((parseInt(page) - 1) * 10)
      .limit(parseInt(pageSize))
      .populate("actor", "number name")
      .populate("account", "platform alias")
      .populate("schedule"),
    ScheduleResultModel.countDocuments(query)
  ]);
}

const updateScheduleResults = (results) => {
  const updates = results.map(({ id, status, post, reason }) => ({
    updateOne: {
      filter: { _id: id },
      update: { $set: { status, post, reason } }
    }
  }));
  return ScheduleResultModel.bulkWrite(updates);
}

const updateScheduleResult = (result) => {
  const { id, status, post, reason } = result;
  return ScheduleResultModel.findByIdAndUpdate(id, { $set: { status, post, reason } });
}

const loadLivingSchedules = (accountId) =>
  ScheduleResultModel.find({ account: accountId, status: { $lte: ScheduleStatus.SCHEDULED } })
    .populate("schedule", "media preview folder title tags type price scheduledAt");

const setExpiredSchedules = (accountId) =>
  ScheduleResultModel.updateMany({ account: accountId, status: ScheduleStatus.WAITING, scheduledAt: { $lt: new Date() } }, { $set: { status: ScheduleStatus.EXPIRED } })

const createScheduleResults = (scheduleId, accounts, { agencyId, modelId, scheduledAt }) =>
  ScheduleResultModel.bulkWrite(accounts.map(account => ({
    insertOne: {
      document: {
        owner: agencyId,
        actor: modelId,
        scheduledAt,
        schedule: scheduleId,
        account: account._id,
        platform: account.platform,
      }
    }
  })));

const setScheduleResults = (scheduleId, results) =>
  ScheduleModel.findByIdAndUpdate(scheduleId, { $set: { results } });

const deleteScheduleResults = (scheduleId) =>
  ScheduleResultModel.deleteMany({ schedule: scheduleId });

const deleteScheduleResult = (resultId) =>
  ScheduleResultModel.findByIdAndDelete(resultId);

const getScheduleResult = (resultId) =>
  ScheduleResultModel.findById(resultId);

const resetScheduleResult = (resultId, scheduledAt) =>
  ScheduleResultModel.findByIdAndUpdate(resultId, { $set: { status: ScheduleStatus.WAITING, scheduledAt } });


const getAllScheduleResults = () =>
  ScheduleResultModel.find()
    .populate({
      path: "schedule",
      select: "owner actor scheduledAt",
      populate: {
        path: "actor",
        select: "number name"
      }
    })
    .populate("account", "platform");

const fixScheduleResult = (resultId, schedule, account) =>
  ScheduleResultModel.findByIdAndUpdate(resultId, {
    $set: {
      owner: schedule.owner,
      actor: schedule.actor,
      scheduledAt: schedule.scheduledAt,
      platform: account.platform
    }
  })

const removeScheduleResult = (scheduleId, resultId) =>
  ScheduleModel.findByIdAndUpdate(scheduleId, { $pull: { results: resultId } })

const ScheduleService2 = {
  getSchedule,
  deleteSchedule,
  createSchedule,
  changeSchedule,
  updateScheduleResults,
  updateScheduleResult,
  loadSchedulesWithPage,
  loadAgencySchedulesWithPage,
  loadLivingSchedules,
  loadScheduleResultsWithPage,
  loadAgencyScheduleResultsWithPage,
  createScheduleResults,
  getScheduleResult,
  setScheduleResults,
  deleteScheduleResult,
  deleteScheduleResults,
  resetScheduleResult,
  removeScheduleResult,

  getAllScheduleResults,
  fixScheduleResult,
  setExpiredSchedules,
}

module.exports = ScheduleService2