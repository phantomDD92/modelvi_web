const express = require("express");
const checkLikeBot = require("../../middleware/likebot");
const checkPostBot = require("../../middleware/postbot");
const LikeBotCtrl2 = require("../../controllers/v2/likebot");
const PostBotCtrl2 = require("../../controllers/v2/postbot");

const router = express.Router();

router.route("/version")
  .get((req, res) => { res.json({ success: true, version: "bot api version 2.0" }) });

router.route("/post/platform/:platform")
  .get(PostBotCtrl2.handleLoadAccounts)
  .post(PostBotCtrl2.handleLoginAccount)

router.route("/post/account")
  .all(checkPostBot)
  .get(PostBotCtrl2.handleGetAccount)
  .post(PostBotCtrl2.handleUpdateAccount)
  .delete(PostBotCtrl2.handleGetCredential)

router.route("/post/proxy")
  .all(checkPostBot)
  .put(PostBotCtrl2.handleChangeProxy)

router.route("/post/log")
  .all(checkPostBot)
  .post(PostBotCtrl2.handleCreateLog)
  
router.route("/post/history")
  .all(checkPostBot)
  .post(PostBotCtrl2.handleCreateHistory)
  .put(PostBotCtrl2.handleCreateLastError)
  .delete(PostBotCtrl2.handleClearLastError)

router.route("/post/time")
  .all(checkPostBot)
  .post(PostBotCtrl2.handleUpdateTime)

router.route("/post/schedule")
  .all(checkPostBot)

router.route("/post/daily")
  .all(checkPostBot)

router.route("/post/balance")
  .all(checkPostBot)
  .post(PostBotCtrl2.handleCheckBalance)
  .put(PostBotCtrl2.handleTestBalance)

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

router.route("/like/comment")
  .all(checkLikeBot)
  .post(LikeBotCtrl2.handlePickCommentForBot)

router.route("/like/history")
  .all(checkLikeBot)
  .post(LikeBotCtrl2.handleCreateHistoryForBot)
  .put(LikeBotCtrl2.handleSetErrorForBot)


module.exports = router;