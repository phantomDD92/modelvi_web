const DailyModel = require("../models/daily");

const createTask = (account, schedule, scheduledAt) => 
    DailyModel.create({
        account,
        schedule,
        scheduledAt,
        finished: false
    });

const deleteBySchdule = (scheduleId) => 
    DailyModel.deleteMany({schedule: scheduleId});

const findNextTask = (account) => {
    return new Promise((resolve, reject) => {
        DailyModel.find({ account, finished: false })
            .sort("scheduledAt")
            .then(tasks => resolve(tasks.length > 0 ? tasks[0] : undefined))
            .catch(err => reject(err));
    });
}

const findBySchedule = (scheduleId) =>
    DailyModel.find({schedule: scheduleId});

const changeScheduledAt = (scheduleId, scheduledAt) =>
    DailyModel.updateMany({schedule: scheduleId}, {$set : {scheduledAt}});

const DailyService = {
    createTask,
    deleteBySchdule,
    findNextTask,
    findBySchedule,
    changeScheduledAt, 
}

module.exports = DailyService