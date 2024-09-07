const ScheduleModel = require("../models/schedule")

const loadSchedules = (searchParams, { page, pageSize }) =>
    Promise.all([
        ScheduleModel.find(searchParams)
            .sort("-scheduledAt")
            .skip((parseInt(page) - 1) * parseInt(pageSize))
            .limit(parseInt(pageSize))
            .populate({
                path: "actor",
                select: "number name",
            }),
        ScheduleModel.countDocuments(searchParams)
    ]);

const createSchedule = ({ actor, owner, file, platform, type, title, folder, description, tags, price, scheduledAt }) =>
    ScheduleModel.create({
        actor,
        owner,
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

const changeSchedule = (scheduleId, { file, platform, type, title, folder, description, tags, price, scheduledAt }) =>
    ScheduleModel.findByIdAndUpdate(scheduleId, { file, platform, type, title, folder, description, tags, price, scheduledAt })

const deleteSchedule = (scheduleId) =>
    ScheduleModel.findByIdAndDelete(scheduleId)

const findById = (id) => 
    ScheduleModel.findById(id)

const ScheduleService = {
    loadSchedules,
    createSchedule,
    changeSchedule,
    deleteSchedule,
    findById
}

module.exports = ScheduleService