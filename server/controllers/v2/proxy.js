const ProxyService2 = require("../../services/v2/proxy");
const { sendError, sendResult } = require("../../utils/resp");

const handleLoadProxiesForAdmin = async (req, res) => {
  try {
    const { agency } = req.body;
    const proxies = await ProxyService2.loadAgencyProxies(agency);
    sendResult(res, { proxies })
  } catch (error) {
    sendError(res, error);
  }
}

const ProxyCtrl2 = {
  handleLoadProxiesForAdmin
};

module.exports = ProxyCtrl2;