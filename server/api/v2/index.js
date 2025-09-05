const express = require("express");
const authenticate = require("../../middleware/auth");

const agencyRouter = require("./agency");
const managerRouter = require("./admin");
const botRouter = require("./bot");
const AuthCtrl2 = require("../../controllers/v2/auth");

const router = express.Router();

// Proxy related apis
router.route("/version")
  .get((req, res) => { res.json({ success: true, version: "api version 2.0" }) });

router.route("/auth")
  .put(AuthCtrl2.handleRegisterAgency)
  .post(AuthCtrl2.handleLoginAgency)
  .patch(authenticate, AuthCtrl2.handleGetProfile)

router.route("/profile")
  .get(authenticate, AuthCtrl2.handleGetProfile)

router.route("/contact")
  .post(AuthCtrl2.handleSendContact)

router.route("/affiliate")
  .get(authenticate, AuthCtrl2.handleGetAffiliate)
  .post(AuthCtrl2.handleCreateAffiliateClick)
  .put(AuthCtrl2.handleUpdateAffiliateRegistration)

router.use("/agency", agencyRouter);

router.use("/admin", managerRouter);

router.use("/bot", botRouter);

router.route("/verify")
  .post(AuthCtrl2.handleVerifyAgency)

module.exports = router;