const AccountService = require("../services/account");
const ActorService = require("../services/actor");
const DiscordService = require("../services/discord");
const ProxyService = require("../services/proxy");
const { sendError, sendResult } = require("../utils/resp")

const handleGetStats = async (req, res) => {
    try {
        const actorCount = await ActorService.getCount(req.manager);
        const discordCount = await DiscordService.getCount();
        const proxyCount = await ProxyService.getCount(req.manager);
        const [f2fCount, fncCount] = await AccountService.getCount(req.manager);
        sendResult(res, { stats: { actorCount, discordCount, proxyCount, f2fCount, fncCount } });
    } catch (error) {
        sendError(res, error)
    }
}

const DashboardCtrl = {
    handleGetStats,
}

module.exports = DashboardCtrl