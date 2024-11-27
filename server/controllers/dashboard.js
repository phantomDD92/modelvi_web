const AccountService = require("../services/account");
const ActorService = require("../services/actor");
const DiscordService = require("../services/discord");
const ProxyService = require("../services/proxy");
const { sendError, sendResult } = require("../utils/resp")

const handleGetStats = async (req, res) => {
    try {
        const [actorCount, actorUpdatedCount] = await ActorService.getCount(req.manager);
        // const discordCount = await DiscordService.getCount();
        const [proxyCount, proxyExpiredCount] = await ProxyService.getCount(req.manager);
        const [f2fCount, fncCount, fanCount, f2fDisabledCount, fncDisabledCount, fanDisabledCount, f2fRunningCount, fncRunningCount, fanRunningCount] = await AccountService.getCount(req.manager);
        const disabledAccounts = await AccountService.loadDisabledAccounts(req.manager);
        sendResult(res, {
            stats: {
                actorCount, actorUpdatedCount,
                proxyCount, proxyExpiredCount,
                f2fCount, fncCount, fanCount,
                f2fDisabledCount, fncDisabledCount, fanDisabledCount,
                f2fRunningCount, fncRunningCount, fanRunningCount
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