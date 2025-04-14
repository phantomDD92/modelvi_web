const express = require("express");
const authenticate = require("../../middleware/auth");
const checkManager = require("../../middleware/manager");
const AgencyCtrl2 = require("../../controllers/v2/agency");
const AffiliateCtrl2 = require("../../controllers/v2/affiliate");
const ProxyCtrl2 = require("../../controllers/v2/proxy");

const router = express.Router();

router.route("/version")
  .get((req, res) => { res.json({ success: true, version: "manager api version 2.0" }) });

router.route("/agency")
  .all(authenticate, checkManager)
  .get(AgencyCtrl2.handleLoadAgenciesForAdmin)

router.route("/agency/:id")
  .all(authenticate, checkManager)
  .put(AgencyCtrl2.handleUpdateAgencyForAdmin)

router.route("/affiliate")
  .all(authenticate, checkManager)
  .get(AffiliateCtrl2.handleLoadAffiliatesForAdmin)

router.route("/proxy")
  .all(authenticate, checkManager)
  .get(ProxyCtrl2.handleLoadProxiesForAdmin)
  .delete(ProxyCtrl2.handleClearProxiesForAdmin)

router.route("/proxy/:agencyId")
  .all(authenticate, checkManager)
  .get(ProxyCtrl2.handleLoadAgencyProxiesForAdmin)
  .post(ProxyCtrl2.handleAppendProxiesForAdmin)
  .put(ProxyCtrl2.handleUpdateProxiesForAdmin)
  .delete(ProxyCtrl2.handleDeleteProxiesForAdmin)

router.route("/proxy/:agencyId/:proxyId")
  .all(authenticate, checkManager)
  .put(ProxyCtrl2.handleUpdateProxyForAdmin)
  .delete(ProxyCtrl2.handleDeleteProxyForAdmin)

module.exports = router;