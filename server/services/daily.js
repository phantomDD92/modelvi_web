const DailyModel = require("../models/daily")

const createTask = (account, schedule) => 
    DailyModel.create({
        account,
        schedule,
        finished: false
    });

const deleteBySchdule = (scheduleId) => 
    DailyModel.deleteMany({schedule: scheduleId});

const DailyService = {
    createTask,
    deleteBySchdule,
}

module.exports = DailyService