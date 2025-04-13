const express = require("express");
const authenticate = require("../../middleware/auth");
const checkManager = require("../../middleware/manager");
const AgencyCtrl2 = require("../../controllers/v2/agency");
const AffiliateCtrl2 = require("../../controllers/v2/affiliate");

const router = express.Router();

router.route("/version")
  .get((req, res) => { res.json({ success: true, version: "manager api version 2.0" }) });

router.route("/agency/:id")
  .all(authenticate, checkManager)
  .put(AgencyCtrl2.handleUpdateAgencyForAdmin)

router.route("/affiliate")
  .all(authenticate, checkManager)
  .get(AffiliateCtrl2.handleLoadAffiliatesForAdmin)

route.route("/proxy")
  .all(authenticate, checkManager)
  .get(ProxyCtrl2.handleLoadProxiesForAdmin)
  
module.exports = router;