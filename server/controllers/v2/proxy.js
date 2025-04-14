const AgencyService2 = require("../../services/v2/agency");
const ProxyService2 = require("../../services/v2/proxy");
const { sendError, sendResult, ApiError } = require("../../utils/resp");

const handleLoadProxiesForAdmin = async (req, res) => {
  try {
    const { agency } = req.query;
    const proxies = await ProxyService2.loadAgencyProxies(agency);
    const stats = await ProxyService2.getTotalStats();
    sendResult(res, { proxies, stats })
  } catch (error) {
    sendError(res, error);
  }
}

const handleAppendProxiesForAdmin = async (req, res) => {
  try {
    const { agencyId } = req.params;
    const { proxies, deadline } = req.body;
    const agency = await AgencyService2.findAgencyById(agencyId);
    if (!agency)
      throw new ApiError("Agency does not exist");
    await ProxyService2.appendAgencyProxies(agencyId, proxies, deadline);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
}

const handleClearProxiesForAdmin = async (req, res) => {
  try {
    await ProxyService2.clearProxies();
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
}

const handleUpdateProxiesForAdmin = async (req, res) => {
  try {
    const { agencyId } = req.params;
    const { action, ...params } = req.body;
    const agency = await AgencyService2.findAgencyById(agencyId);
    if (!agency)
      throw new ApiError("Agency does not exist");
    switch (action) {
      case "clear":
        await ProxyService2.clearAgencyProxies(agencyId);
        break;
      case "status":
        const { proxyIds, status } = params;
        await ProxyService2.changeProxiesStatus(proxyIds, status);
        break;
      default:
        throw new ApiError("Invalid admin proxy action");
    }
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
}

const handleLoadAgencyProxiesForAdmin = async (req, res) => {
  try {
    const { agencyId } = req.params;
    const agency = await AgencyService2.getAgency(agencyId)
    if (!agency)
      throw new ApiError("Agency does not exist");
    const proxies = await ProxyService2.loadAgencyProxies(agencyId);
    sendResult(res, { agency, proxies });
  } catch (error) {
    sendError(res, error);
  }
}

const handleDeleteProxiesForAdmin = async (req, res) => {
  try {
    const { proxyIds } = req.body
    await ProxyService2.deleteProxies(proxyIds);
    sendResult(res);
  } catch (error) {
    sendError(res, error)
  }
}

const handleUpdateProxyForAdmin = async (req, res) => {
  try {
    const { proxyId } = req.params
    const { action, ...params } = req.body
    const proxy = await ProxyService2.findProxyById(proxyId)
    if (!proxy)
      throw new ApiError("Proxy does not exist.")
    switch (action) {
      case "status":
        const { status } = params;
        await ProxyService2.changeProxyStatus(proxyId, status);
        break;
      case "reset":
        const { platform } = params;
        await ProxyService2.resetProxyAccount(proxyId, platform);
        break;
      default:
        throw new ApiError("Invalid proxy operation");
    }
    sendResult(res)
  } catch (error) {
    sendError(res, error)
  }
}

const handleDeleteProxyForAdmin = async (req, res) => {
  try {
    const { proxyId } = req.params;
    await ProxyService2.deleteProxy(proxyId);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
}

const handleLoadProxiesForAgency = async (req, res) => {
  try {
    const proxies = await ProxyService2.loadAgencyProxies(req.manager._id)
    sendResult(res, { proxies })
  } catch (error) {
    sendError(res, error)
  }
}

const handleAppendProxiesForAgency = async (req, res) => {
  try {
    const { proxies, deadline } = req.body;
    await ProxyService2.appendAgencyProxies(req.manager._id, proxies, deadline);
    sendResult(res)
  } catch (error) {
    sendError(res, error);
  }
}

const handleUpdateProxiesForAgency = async (req, res) => {
  try {
    const { action, ...params } = req.body
    switch (action) {
      case "clear":
        await ProxyService2.clearAgencyProxies(req.manager._id);
        break;
      case "status":
        const { proxyIds, status } = params;
        await ProxyService2.changeProxiesStatus(proxyIds, status);
        break;
      default:
        throw new ApiError("Invalid proxy operation");
    }
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
}

const handleUpdateProxyForAgency = async (req, res) => {
  try {
    const { proxyId } = req.params
    const { action, ...params } = req.body
    const proxy = await ProxyService2.findProxyById(proxyId)
    if (!proxy)
      throw new ApiError("Proxy doesn't exist.")
    if (req.manager._id.toString() != proxy.owner.toString())
      throw new ApiError("Proxy can be changed only by owner.")
    switch (action) {
      case "status":
        const { status } = params;
        await ProxyService2.changeProxyStatus(proxyId, status);
        break;
      case "reset":
        const { platform } = params;
        await ProxyService2.resetProxyAccount(proxyId, platform);
        break;
      default:
        throw new ApiError("Invalid proxy operation");
    }
    sendResult(res)
  } catch (error) {
    sendError(res, error)
  }
}

const handleDeleteProxyForAgency = async (req, res) => {
  try {
    const { proxyId } = req.params
    const proxy = await ProxyService2.findProxyById(proxyId)
    if (!proxy)
      throw new ApiError("Proxy doesn't exist")
    if (req.manager._id.toString() != proxy.owner.toString())
      throw new ApiError("Proxy can be deleted only by owner.")
    await ProxyService2.deleteProxy(proxyId);
    sendResult(res);
  } catch (error) {
    sendError(res, error)
  }
}

const handleDeleteProxiesForAgency = async (req, res) => {
  try {
    const { proxyIds } = req.body
    await ProxyService2.deleteProxies(proxyIds);
    sendResult(res);
  } catch (error) {
    sendError(res, error)
  }
}

const ProxyCtrl2 = {
  handleLoadProxiesForAdmin,
  handleClearProxiesForAdmin,

  handleAppendProxiesForAdmin,
  handleUpdateProxiesForAdmin,
  handleLoadAgencyProxiesForAdmin,
  handleDeleteProxiesForAdmin,
  handleUpdateProxyForAdmin,
  handleDeleteProxyForAdmin,

  handleLoadProxiesForAgency,
  handleUpdateProxiesForAgency,
  handleDeleteProxiesForAgency,
  handleAppendProxiesForAgency,
  handleUpdateProxyForAgency,
  handleDeleteProxyForAgency
};

module.exports = ProxyCtrl2;