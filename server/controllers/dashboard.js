const AccountService = require("../services/account");
const ActorService = require("../services/actor");
const ChatTeamService = require("../services/chatteam");
const ProxyService = require("../services/proxy");
const { sendError, sendResult } = require("../utils/resp")

const handleGetStats = async (req, res) => {
    try {
        const [actorCount, actorUpdatedCount] = await ActorService.getCount(req.manager);
        const teamCount = await ChatTeamService.getCount();
        const [proxyCount, proxyExpiredCount] = await ProxyService.getCount(req.manager);
        const [
            f2fCount, 
            fncCount, 
            fanCount, 
            fanvueCount, 
            knkyCount, 
            f2fDisabledCount, 
            fncDisabledCount, 
            fanDisabledCount, 
            fanvueDisabledCount, 
            knkyDisabledCount, 
            f2fRunningCount, 
            fncRunningCount, 
            fanRunningCount,
            fanvueRunningCount, 
            knkyRunningCount
        ] = await AccountService.getCount(req.manager);
        const disabledAccounts = await AccountService.loadDisabledAccounts(req.manager);
        sendResult(res, {
            stats: {
                actorCount, actorUpdatedCount,
                proxyCount, proxyExpiredCount,
                f2fCount, fncCount, fanCount, fanvueCount, knkyCount,
                f2fDisabledCount, fncDisabledCount, fanDisabledCount, fanvueDisabledCount, knkyDisabledCount,
                f2fRunningCount, fncRunningCount, fanRunningCount, fanvueRunningCount, knkyRunningCount,
                teamCount,
            },
            disabledAccounts,
        });
    } catch (error) {
        sendError(res, error)
    }
}

const DashboardCtrl = {
    handleGetStats,
}

module.exports = DashboardCtrl