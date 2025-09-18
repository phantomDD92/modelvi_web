const express = require("express");
const checkBot = require("../middleware/postbot");
const PostBotCtrl2 = require("../controllers/v2/postbot");


const router = express.Router();

router.route("/platform/:platform")
  .get(PostBotCtrl2.handleLoadAccounts)
  .post(PostBotCtrl2.handleLoginAccount)

router.route("/account")
  .all(checkBot)
  .get(PostBotCtrl2.handleGetAccount)
  .post(PostBotCtrl2.handleUpdateAccount)
  .delete(PostBotCtrl2.handleGetCredential)

router.route("/proxy")
  .all(checkBot)
  .put(PostBotCtrl2.handleChangeProxy)

router.route("/history")
  .all(checkBot)
  .post(PostBotCtrl2.handleCreateHistory)
  .put(PostBotCtrl2.handleCreateLastError)
  .delete(PostBotCtrl2.handleClearLastError)

router.route("/time")
  .all(checkBot)
  .post(PostBotCtrl2.handleUpdateTime)

router.route("/balance")
  .all(checkBot)
  .post(PostBotCtrl2.handleCheckBalance)
  .put(PostBotCtrl2.handleTestBalance)

module.exports = router;
