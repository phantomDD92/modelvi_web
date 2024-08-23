const { Platform } = require("../config/const");
const AccountService = require("../services/account");
const ActorService = require("../services/actor");
const ScheduleService = require("../services/schedule");
const { ApiError } = require("../utils/resp");

const handleLoadSchedules = async (req, res) => {
    try {
        const { platform, actor, page, pageSize } = req.query;
        const [schedules, schedulesCount] = await ScheduleService.loadSchedules(
            { platform: platform == Platform.ALL ? undefined : platform, actor },
            { page, pageSize: pageSize || "10" }
        )
        sendResult(res, { schedules, schedulesCount });
    } catch (error) {
        console.error(error);
        sendError(res, error);
    }
};

const handleCreateSchedule = async (res, req) => {
    try {
        const {actor, ...params} = req.body;
        const actorInst = await ActorService.findById(actor)
        if (!actorInst)
            throw new ApiError("Model does not exist");
        await ScheduleService.createSchedule(params)
        sendResult(res);
    } catch (error) {
        console.error(error);
        sendError(res, error);
    }
}

const handleChangeSchedule = async (res, req) => {
    try {
        const { id } = req.params;
        const params = req.body;
        await ScheduleService.changeSchedule(id, params)
        sendResult(res);
    } catch (error) {
        console.error(error);
        sendError(res, error);
    }
}

const handleDeleteSchedule = async (res, req) => {
    try {
        const { id } = req.params;
        await ScheduleService.deleteSchedule(id);
        sendResult(res);
    } catch (error) {
        console.error(error);
        sendError(res, error);
    }
}

const PostCtrl = {
    handleLoadSchedules,
    handleCreateSchedule,
    handleChangeSchedule,
    handleDeleteSchedule,
}

module.exports = PostCtrl