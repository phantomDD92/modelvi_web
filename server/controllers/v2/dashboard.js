const AccountService2 = require("../../services/v2/account");
const ChatTeamService2 = require("../../services/v2/chatteam");
const ModelService2 = require("../../services/v2/model");
const { sendResult, sendError } = require("../../utils/resp");

const handleGetStatsForAgency = async (req, res) => {
    try {
        const modelStats = await ModelService2.getCountStats(req.manager._id)
        const teamCount = await ChatTeamService2.getCount(req.manager._id);
        const accountStats = await AccountService2.getCountStats(req.manager._id);
        const disabledAccounts = await AccountService2.getDisabledAccounts(req.manager._id);
        sendResult(res, {
            stats: {
                modelStats,
                teamCount,
                accountStats,
            },
            disabledAccounts,
        });
    } catch (error) {
        sendError(res, error)
    }
}

const handleGetStatsForAdmin = async (req, res) => {
    try {
        const modelStats = await ModelService2.getCountStats()
        const teamCount = await ChatTeamService2.getCount();
        const accountStats = await AccountService2.getCountStats();
        const disabledAccounts = await AccountService2.getDisabledAccounts();
        sendResult(res, {
            stats: {
                modelStats,
                teamCount,
                accountStats,
            },
            disabledAccounts,
        });
    } catch (error) {
        sendError(res, error)
    }
}

const DashboardCtrl2 = {
    handleGetStatsForAgency,
    handleGetStatsForAdmin
}

module.exports = DashboardCtrl2