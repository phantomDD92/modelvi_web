const HistoryService = require("../services/history");
const { sendError, sendResult } = require("../utils/resp");

const handleLoadHistories = async (req, res) => {
    try {
        const {page, pageSize} = req.query
        const { accountId } = req.params;
        const [history, historyCount] = await HistoryService.loadHistories(accountId, {page, pageSize: pageSize || "10"});
        sendResult(res, { history, historyCount })
    } catch (error) {
        sendError(res, error)
    }
}


const HistoryCtrl = {
    handleLoadHistories
};

module.exports = HistoryCtrl;