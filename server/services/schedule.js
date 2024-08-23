const ScheduleModel = require("../models/schedule")

const loadSchedules = (search, { page, pageSize }) =>
    Promise.all([
        ScheduleModel.find(search)
            .sort("-scheduledAt")
            .skip((parseInt(page) - 1) * parseInt(pageSize))
            .limit(parseInt(pageSize))
            .populate({
                path: "actor",
                select: "number name",
            })
            .populate({
                path: "account",
                select: "alias",
            }),
        ScheduleModel.countDocuments(search)
    ]);

const createSchedule = ({ actor, file, platform, type, title, folder, description, tags, price, scheduledAt }) =>
    ScheduleModel.create({
        actor,
        account,
        file,
        platform,
        type,
        title,
        folder,
        description,
        tags,
        price,
        scheduledAt
    })

const changeSchedule = (scheduleId, { actor, file, platform, type, title, folder, description, tags, price, scheduledAt }) =>
    ScheduleModel.findByIdAndUpdate(scheduleId, { actor, file, platform, type, title, folder, description, tags, price, scheduledAt })

const deleteSchedule = (scheduleId) =>
    ScheduleModel.findByIdAndDelete(scheduleId)

const ScheduleService = {
    loadSchedules,
    createSchedule,
    changeSchedule,
    deleteSchedule,
}

module.exports = ScheduleService