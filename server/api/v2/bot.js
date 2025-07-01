const express = require("express");
const LikeBotCtrl2 = require("../../controllers/v2/likebot");
const checkLikeBot = require("../../middleware/likebot");
const AccountCtrl2 = require("../../controllers/v2/account");

const router = express.Router();

router.route("/version")
  .get((req, res) => { res.json({ success: true, version: "bot api version 2.0" }) });

router.route("/platform/:platform")
  .get(AccountCtrl2.handleLoadAccountsForBot)

router.route("/like/platform/:platform")
  .get(LikeBotCtrl2.handleLoadBotsForBot)
  .post(LikeBotCtrl2.handleCheckBotForBot)

router.route("/like/team/:platform")
  .all(checkLikeBot)
  .get(LikeBotCtrl2.handleLoadTeamsForBot)

router.route("/like/account")
  .all(checkLikeBot)
  .get(LikeBotCtrl2.handleGetBotForBot)
  .put(LikeBotCtrl2.handleUpdateBotForBot)


module.exports = router;