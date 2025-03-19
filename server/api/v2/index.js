const express = require("express");
const AgencyCtrlV2 = require("../../controllers/v2/agency");
const authenticate = require("../../middleware/auth");

const router = express.Router();

// Proxy related apis
router.route("/version")
  .get((req, res) => { res.json({ success: true, version: "2.0" }) });

router.route("/auth")
  .put(AgencyCtrlV2.handleRegisterAgency)
  .post(AgencyCtrlV2.handleLoginAgency)
  .patch(authenticate, AgencyCtrlV2.handleRefreshToken)
  

module.exports = router;