const express = require("express");
const authenticate = require("../../middleware/auth");
const checkManager = require("../../middleware/manager");
const AgencyCtrl2 = require("../../controllers/v2/agency");
const AffiliateCtrl2 = require("../../controllers/v2/affiliate");
const ProxyCtrl2 = require("../../controllers/v2/proxy");
const ChatTeamCtrl2 = require("../../controllers/v2/chatteam");

const router = express.Router();

router.route("/version")
  .get((req, res) => { res.json({ success: true, version: "manager api version 2.0" }) });

router.route("/agency_list")
  .all(authenticate, checkManager)
  .get(AgencyCtrl2.handleLoadAgencyListForAdmin);
  
router.route("/agency")
  .all(authenticate, checkManager)
  .get(AgencyCtrl2.handleLoadAgenciesForAdmin)
  .put(AgencyCtrl2.handleUpdateAgenciesForAdmin)
  .delete(AgencyCtrl2.handleDeleteAgenciesForAdmin)

router.route("/agency/:agencyId")
  .all(authenticate, checkManager)
  .put(AgencyCtrl2.handleUpdateAgencyForAdmin)
  .delete(AgencyCtrl2.handleDeleteAgencyForAdmin)

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

router.route("/chat")
  .all(authenticate, checkManager)
  .get(ChatTeamCtrl2.handleLoadChatTeamsForAdmin)
  .post(ChatTeamCtrl2.handleCreateChatTeamForAdmin)
  .delete(ChatTeamCtrl2.handleDeleteChatTeamsForAdmin)

router.route("/chat/:id")
  .all(authenticate, checkManager)
  .put(ChatTeamCtrl2.handleUpdateChatTeamForAdmin)
  .delete(ChatTeamCtrl2.handleDeleteChatTeamForAdmin)

router.route("/account")
  .all(authenticate, checkManager)
  .get()
  .delete(ProxyCtrl2.handleClearProxiesForAdmin)
module.exports = router;