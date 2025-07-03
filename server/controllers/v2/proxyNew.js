const ProxyNewService2 = require("../../services/v2/proxyNew");
const { sendError, sendResult, ApiError } = require("../../utils/resp");

const handleLoadProxiesForAdmin = async (req, res) => {
  try {
    const proxies = await ProxyNewService2.loadProxies()
    sendResult(res, { proxies })
  } catch (error) {
    sendError(res, error);
  }
}

const handleAppendProxiesForAdmin = async (req, res) => {
  try {
    const { proxies } = req.body;
    await ProxyNewService2.appendProxies(proxies);
    sendResult(res)
  } catch (error) {
    sendError(res, error);
  }
}

const handleDeleteProxyForAdmin = async (req, res) => {
  try {
    const { proxyId } = req.params;
    await ProxyNewService2.deleteProxy(proxyId);
    sendResult(res)
  } catch (error) {
    sendError(res, error);
  }
}

const handleClearProxiesForAdmin = async (req, res) => {
  try {
    await ProxyNewService2.clearProxies();
    sendResult(res)
  } catch (error) {
    sendError(res, error);
  }
}

const handleUpdateProxyForAdmin = async (req, res) => {
  try {
    const { proxyId } = req.params;
    const { action, params } = req.body;
    switch (action) {
      case "status":
        const { status } = params;
        await ProxyNewService2.changeStatus(proxyId, status)
        break
      default:
        throw new ApiError("invalid proxy admin operation");
    }
    sendResult(res)
  } catch (error) {
    sendError(res, error);
  }
}


const ProxyNewCtrl2 = {
  handleLoadProxiesForAdmin,
  handleAppendProxiesForAdmin,
  handleClearProxiesForAdmin,
  handleDeleteProxyForAdmin,
  handleUpdateProxyForAdmin,
}

module.exports = ProxyNewCtrl2;