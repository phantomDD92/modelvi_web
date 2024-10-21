const express = require("express");
const BotController = require("./controller");
const checkBot = require("../middleware/bot");


const router = express.Router();

router.route("/platform/:platform")
  .get(BotController.handleLoadAccounts)
  .post(BotController.handleLoginAccount)

router.route("/account")
  .all(checkBot)
  .get(BotController.handleGetAccount)
  .post(BotController.handleUpdateAccount)
  .put(BotController.handleChangeAccount)
  .delete(BotController.handleGetCredential)

router.route("/proxy")
  .all(checkBot)
  .get(BotController.handlePickProxy)
  .put(BotController.handleBlockProxy)

router.route("/history")
  .all(checkBot)
  .post(BotController.handleCreateHistory)
  .put(BotController.handleCreateLastError)
  .delete(BotController.handleClearLastError)

router.route("/time")
  .all(checkBot)
  .post(BotController.handleUpdateTime)

router.route("/log")
  // .all(checkBot)
  .post(BotController.handleCreateLog)

router.route("/schedule")
  .all(checkBot)

router.route("/daily")
  .all(checkBot)

router.route("/action")
  .all(checkBot)
  .put(BotController.handleFindCommentAction)
  .post(BotController.handleCreateCommentAction)


module.exports = router;
