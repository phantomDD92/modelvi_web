const express = require("express");
const multer = require('multer')
const path = require('path')
const { v4: uuidv4 } = require("uuid")

const mediaStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const fileName = uuidv4();
    cb(null, fileName + path.extname(file.originalname))
  }
});
const imageUpload = multer({ storage: mediaStorage })

const authenticate = require("../middleware/auth.js");
const ActorCtrl = require("../controllers/actor.js");
const AccountCtrl = require("../controllers/account.js");
const ChatTeamCtrl = require("../controllers/chatteam.js");
const DashboardCtrl = require("../controllers/dashboard.js");
const ManagerCtrl = require("../controllers/manager.js");
const CommentCtrl = require("../controllers/comment.js");
const HistoryCtrl = require("../controllers/history.js");
const ScheduleCtrl = require("../controllers/schedule.js");
const checkManager = require("../middleware/manager.js");
const UserCtrl = require("../controllers/user.js");

const apiRouterV2 = require("./v2");

const router = express.Router();

router.route("/chat_all")
  .all(authenticate)
  .get(ChatTeamCtrl.handleLoadAllChatTeams)

// Chat team related apis
router.route("/chat")
  .all(authenticate, checkManager)
  .get(ChatTeamCtrl.handleLoadChatTeams)
  .post(ChatTeamCtrl.handleCreateChatTeam)
  .delete(ChatTeamCtrl.handleDeleteBulkChatTeams)

router.route("/chat/:id")
  .all(authenticate, checkManager)
  .put(ChatTeamCtrl.handleUpdateChatTeam)
  .delete(ChatTeamCtrl.handleDeleteChatTeam)

router.route("/temp")
  .all(authenticate, checkManager)
  .post(ManagerCtrl.handleUpdateDB);

router.route("/manager")
  .all(authenticate, checkManager)
  .get(ManagerCtrl.handleLoadAgencies)
  .post(ManagerCtrl.handleCreateAgency)
  .put(ManagerCtrl.handleUpdateBulkAgencies)
  .delete(ManagerCtrl.handleDeleteBulkAgencies);

router.route("/manager/:id")
  .all(authenticate, checkManager)
  .put(ManagerCtrl.handleUpdateAgency)
  .delete(ManagerCtrl.handleDeleteAgency)


router.route("/auth")
  .post(ManagerCtrl.handleLoginManager)
  .put(ManagerCtrl.handleChangePassword)
  // .patch(ManagerCtrl.handleUpdateManager)
  .get(authenticate, ManagerCtrl.handleReloadManager)

router.route("/stats")
  .all(authenticate)
  .get(DashboardCtrl.handleGetStats)

router
  .route("/actor")
  .all(authenticate)
  .get(ActorCtrl.handleLoadActors)
  .post(ActorCtrl.handleCreateActor)
  .put(ActorCtrl.handleUpdateActors)
  .delete(ActorCtrl.handleDeleteActors)

router
  .route("/actor/:actorId")
  .all(authenticate)
  .put(ActorCtrl.handleUpdateActor)
  .delete(ActorCtrl.handleDeleteActor);

router
  .route("/content/:actorId")
  .all(authenticate)
  .get(ActorCtrl.handleGetContents)
  .post(ActorCtrl.handleAppendContent)
  .put(ActorCtrl.handleUpdateContents)
  .delete(ActorCtrl.handleDeleteContents);

router
  .route("/content/:actorId/:contentId")
  .all(authenticate)
  .put(ActorCtrl.handleUpdateContent)
  .delete(ActorCtrl.handleDeleteContent);

router
  .route("/account/:platform")
  .all(authenticate)
  .get(AccountCtrl.handleLoadAccounts)
  .post(AccountCtrl.handleCreateAccount)
  .put(AccountCtrl.handleUpdateAccounts)
  .delete(AccountCtrl.handleDeleteAccounts);

router
  .route("/account/:platform/:id")
  .all(authenticate)
  .put(AccountCtrl.handleUpdateAccount)
  // .post(AccountCtrl.handleUpdateParams)
  .delete(AccountCtrl.handleDeleteAccount);

router
  .route("/history/:platform/:id")
  .all(authenticate)
  .get(AccountCtrl.handleLoadHistory)
  .post(AccountCtrl.handleClearError)
  .delete(AccountCtrl.handleClearHistory);

router
  .route("/comment")
  .all(authenticate)
  .get(CommentCtrl.handleLoadComments)
  .post(CommentCtrl.handleCreateComment)
  .delete(CommentCtrl.handleClearComments);

router
  .route("/comment/:id")
  .all(authenticate)
  .delete(CommentCtrl.handleDeleteComment);

router.route("/agency/comment/:id")
  .all(authenticate)
  .get(CommentCtrl.handleLoadAgencyComments);

router
  .route("/user")
  .all(authenticate)
  .get(UserCtrl.handleLoadUsers)
  .post(UserCtrl.handleCreateUser);

router
  .route("/user/:id")
  .all(authenticate)
  .delete(UserCtrl.handleDeleteUser);

router.route("/agency/user/:id")
  .all(authenticate)
  .get(UserCtrl.handleLoadAgencyUsers);

router
  .route("/history/:accountId")
  .all(authenticate)
  .get(HistoryCtrl.handleLoadHistories);

router.route("/schedule")
  .all(authenticate)
  .get(ScheduleCtrl.handleLoadSchedules)
  .post(ScheduleCtrl.handleCreateSchedule)

router.route("/schedule/:id")
  .all(authenticate)
  .put(ScheduleCtrl.handleChangeSchedule)
  .delete(ScheduleCtrl.handleDeleteSchedule)

router.route("/upload")
  .post(imageUpload.single('file'), (req, res) => { res.json({ file: req.file.filename }) })


router.route("/contact")
  .post(ManagerCtrl.handleSendContact)

router.use("/v2", apiRouterV2);
module.exports = router;
