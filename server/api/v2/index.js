const express = require("express");
const agencyRouter = require("./agency");
const managerRouter = require("./manager");
const botRouter = require("./bot");
const AuthCtrl = require("../../controllers/v2/auth");
const authenticate = require("../../middleware/auth");
const PaymentCtrl = require("../../controllers/v2/payment");

const router = express.Router();

// Proxy related apis
router.route("/version")
  .get((req, res) => { res.json({ success: true, version: "api version 2.0" }) });

router.route("/auth")
  .put(AuthCtrl.handleRegisterAgency)
  .post(AuthCtrl.handleLoginAgency)
  .patch(authenticate, AuthCtrl.handleGetProfile)

router.route("/profile")
  .get(authenticate, AuthCtrl.handleGetProfile)

router.use("/agency", agencyRouter);

router.use("/admin", managerRouter);

router.use("/bot", botRouter);


module.exports = router;