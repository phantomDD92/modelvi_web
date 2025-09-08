const express = require("express");
const BotController = require("./controller");
const checkBot = require("../middleware/postbot");


const router = express.Router();

router.route("/platform/:platform")
  .get(BotController.handleLoadAccounts)
  .post(BotController.handleLoginAccount)

router.route("/account")
  .all(checkBot)
  .get(BotController.handleGetAccount)
  .post(BotController.handleUpdateAccount)
  .delete(BotController.handleGetCredential)

router.route("/proxy")
  .all(checkBot)
  .put(BotController.handleChangeProxy)

router.route("/history")
  .all(checkBot)
  .post(BotController.handleCreateHistory)
  .put(BotController.handleCreateLastError)
  .delete(BotController.handleClearLastError)

router.route("/time")
  .all(checkBot)
  .post(BotController.handleUpdateTime)

router.route("/schedule")
  .all(checkBot)

router.route("/daily")
  .all(checkBot)

router.route("/balance")
  .all(checkBot)
  .post(BotController.handleCheckBalance)
  .put(BotController.handleTestBalance)

module.exports = router;
