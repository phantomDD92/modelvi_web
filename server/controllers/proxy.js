const { AdminRole } = require("../config/const");
const ProxyService = require("../services/proxy");
const { sendResult, sendError, ApiError } = require("../utils/resp");

const handleLoadProxies = async (req, res) => {
    try {
        const { page, pageSize } = req.query;
        const [proxies, proxiesCount] = await ProxyService.loadProxiesWithPage(req.manager, { page, pageSize: pageSize || "10" })
        sendResult(res, { proxies, proxiesCount })
    } catch (error) {
        sendError(res, error)
    }
}

const handleAddProxies = async (req, res) => {
    try {
        const { proxies, deadline } = req.body;
        await ProxyService.addProxies(req.manager, proxies, deadline)
        sendResult(res)
    } catch (error) {
        sendError(res, error);
    }
}

const handleClearProxies = async (req, res) => {
    try {
        await ProxyService.clearProxies(req.manager);
        sendResult(res);
    } catch (error) {
        sendError(res, error);
    }
}

const handleChangeProxyStatus = async (req, res) => {
    try {
        const { id, status } = req.body
        const proxy = await ProxyService.findById(id)
        if (!proxy)
            throw new ApiError("The specified proxy doesn't exist.")
        if (req.manager.role != AdminRole.MANAGER && req.manager._id.toString() != proxy.owner.toString())
            throw new ApiError("The specified proxy can be changed only by owner.")
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
        const proxy = await ProxyService.findById(id)
        if (!proxy)
            throw new ApiError("The specified proxy doesn't exist.")
        if (req.manager.role != AdminRole.MANAGER && req.manager._id.toString() != proxy.owner.toString())
            throw new ApiError("The specified proxy can be changed only by owner.")
        await ProxyService.setProxyStatus(id, status)
        sendResult(res)
    } catch (error) {
        sendError(res, error)
    }
}

const handleDeleteProxy = async (req, res) => {
    try {
        const { id } = req.params
        const proxy = await ProxyService.findById(id)
        if (!proxy)
            throw new ApiError("The specified proxy doesn't exist.")
        if (req.manager.role != AdminRole.MANAGER && req.manager._id.toString() != proxy.owner.toString())
            throw new ApiError("The specified proxy can be deleted only by owner.")
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