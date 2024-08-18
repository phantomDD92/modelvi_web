const ProxyService = require("../services/proxy");
const { sendResult, sendError } = require("../utils/resp");

const handleLoadProxies = async (req, res) => {
    try {
        const { page, pageSize } = req.query;
        const [proxies, proxiesCount] = await ProxyService.loadProxies({ page, pageSize: pageSize || "10" })
        sendResult(res, { proxies, proxiesCount })
    } catch (error) {
        sendError(res, error)
    }
}

const handleAddProxies = async (req, res) => {
    try {
        const { proxies, deadline } = req.body;
        await ProxyService.addProxies(proxies, deadline)
        sendResult(res)
    } catch (error) {
        sendError(res, error);
    }
}

const handleClearProxies = async (req, res) => {
    try {
        await ProxyService.clearProxies();
        sendResult(res);

    } catch (error) {
        sendError(res, error);
    }
}

const handleChangeProxyStatus = async (req, res) => {
    try {
        const { id, status } = req.body
        await ProxyService.setProxyStatus(id, status)
        sendResult(res)
    } catch (error) {
        sendError(res, error);
    }
}

const handleSetProxyStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body
        await ProxyService.setProxyStatus(id, status)
        sendResult(res)
    } catch (error) {
        sendError(res, error)
    }
}

const handleDeleteProxy = async (req, res) => {
    try {
        const { id } = req.params
        await ProxyService.deleteProxy(id);
        sendResult(res);
    } catch (error) {
        sendError(res, error)
    }
}

const ProxyCtrl = {
    handleLoadProxies,
    handleAddProxies,
    handleClearProxies,
    handleChangeProxyStatus,
    handleDeleteProxy,
    handleSetProxyStatus,
}

module.exports = ProxyCtrl