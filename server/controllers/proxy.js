const { AdminRole } = require("../config/const");
const ProxyService = require("../services/proxy");
const { sendResult, sendError, ApiError } = require("../utils/resp");

const handleLoadProxies = async (req, res) => {
    try {
        const { agency: filter } = req.query;
        const proxies = await ProxyService.loadProxies(req.manager, filter)
        sendResult(res, { proxies })
    } catch (error) {
        sendError(res, error)
    }
}

const handleAppendProxies = async (req, res) => {
    try {
        const { proxies, deadline } = req.body;
        await ProxyService.appendProxies(req.manager, proxies, deadline);
        sendResult(res)
    } catch (error) {
        sendError(res, error);
    }
}

const handleClearProxies = async (req, res) => {
    try {
        sendResult(res);
    } catch (error) {
        sendError(res, error);
    }
}

const handleUpdateProxies = async (req, res) => {
    try {
        const { action, ...params } = req.body
        switch (action) {
            case "clear":
                await ProxyService.clearProxies(req.manager);
                break;
            case "status":
                const { proxyIds, status } = params;
                await ProxyService.changeBulkProxiesStatus(req.manager, proxyIds, status);
                break;
            default:
                throw new ApiError("Invalid proxy operation");
        }
        sendResult(res);
    } catch (error) {
        sendError(res, error);
    }
}

const handleUpdateProxy = async (req, res) => {
    try {
        const { id: proxyId } = req.params
        const { action, ...params } = req.body
        const proxy = await ProxyService.findProxyById(proxyId)
        if (!proxy)
            throw new ApiError("Proxy doesn't exist.")
        if (req.manager.role != AdminRole.MANAGER && req.manager._id.toString() != proxy.owner.toString())
            throw new ApiError("The specified proxy can be changed only by owner.")
        switch (action) {
            case "status":
                const { status } = params;
                await ProxyService.changeProxyStatus(proxyId, status);
                break;
            case "reset":
                const { platform } = params;
                await ProxyService.clearProxyAccount(proxyId, platform);
                break;
            default:
                throw new ApiError("Invalid proxy operation");
        }
        sendResult(res)
    } catch (error) {
        sendError(res, error)
    }
}

const handleDeleteProxy = async (req, res) => {
    try {
        const { id: proxyId } = req.params
        const proxy = await ProxyService.findProxyById(proxyId)
        if (!proxy)
            throw new ApiError("Proxy doesn't exist")
        if (req.manager.role != AdminRole.MANAGER && req.manager._id.toString() != proxy.owner.toString())
            throw new ApiError("Proxy can be deleted only by owner.")
        await ProxyService.deleteProxy(proxyId);
        sendResult(res);
    } catch (error) {
        sendError(res, error)
    }
}

const handleDeleteProxies = async (req, res) => {
    try {
        const { proxyIds } = req.body
        await ProxyService.deleteBulkProxies(req.manager, proxyIds);
        sendResult(res);
    } catch (error) {
        sendError(res, error)
    }
}


const ProxyCtrl = {
    handleLoadProxies,
    handleAppendProxies,
    handleClearProxies,
    handleUpdateProxies,
    handleDeleteProxy,
    handleUpdateProxy,
    handleDeleteProxies,
}

module.exports = ProxyCtrl