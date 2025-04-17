const AccountService = require("../services/account");
const ActorService = require("../services/actor");
const ProxyService = require("../services/proxy");
const ChatTeamService2 = require("../services/v2/chatteam");
const { sendError, sendResult } = require("../utils/resp")

const handleGetStats = async (req, res) => {
    try {
        const [actorCount, actorUpdatedCount] = await ActorService.getCount(req.manager);
        const teamCount = await ChatTeamService2.getCount();
        const [proxyCount, proxyExpiredCount] = await ProxyService.getCount(req.manager);
        const [
            f2fCount,
            f2fDisabledCount,
            f2fRunningCount,
            fncCount,
            fncDisabledCount,
            fncRunningCount,
            fanCount,
            fanDisabledCount,
            fanRunningCount,
            fanvueCount,
            fanvueDisabledCount,
            fanvueRunningCount,
            knkyCount,
            knkyDisabledCount,
            knkyRunningCount,
            maloumCount,
            maloumDisabledCount,
            maloumRunningCount
        ] = await AccountService.getCount(req.manager);
        const disabledAccounts = await AccountService.loadDisabledAccounts(req.manager);
        sendResult(res, {
            stats: {
                actorCount, actorUpdatedCount,
                proxyCount, proxyExpiredCount,
                f2fCount, f2fDisabledCount, f2fRunningCount,
                fncCount, fncDisabledCount, fncRunningCount,
                fanCount, fanDisabledCount, fanRunningCount,
                fanvueCount, fanvueDisabledCount, fanvueRunningCount,
                knkyCount, knkyDisabledCount, knkyRunningCount,
                maloumCount, maloumDisabledCount, maloumRunningCount,
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