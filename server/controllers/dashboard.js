const AccountService = require("../services/account");
const ActorService = require("../services/actor");
const DiscordService = require("../services/discord");
const ProxyService = require("../services/proxy");
const { sendError, sendResult } = require("../utils/resp")

const handleGetStats = async (req, res) => {
    try {
        const actorCount = await ActorService.getCount();
        const discordCount = await DiscordService.getCount();
        const proxyCount = await ProxyService.getCount();
        const [f2fCount] = await AccountService.getCount();
        sendResult(res, { stats: { actorCount, discordCount, proxyCount, f2fCount } });
    } catch (error) {
        sendError(res, error)
    }
}

const DashboardCtrl = {
    handleGetStats,
}

module.exports = DashboardCtrl