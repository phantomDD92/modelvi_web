const express = require("express");
const authenticate = require("../../middleware/auth");
const PaymentCtrl2 = require("../../controllers/v2/payment");
const TransactionCtrl2 = require("../../controllers/v2/transaction");
const ProxyCtrl2 = require("../../controllers/v2/proxy");
const ModelCtrl2 = require("../../controllers/v2/model");
const AccountCtrl2 = require("../../controllers/v2/account");
const HistoryCtrl2 = require("../../controllers/v2/history");
const ScheduleCtrl2 = require("../../controllers/v2/schedule");
const ChatTeamCtrl2 = require("../../controllers/v2/chatteam");
const DashboardCtrl2 = require("../../controllers/v2/dashboard");

const router = express.Router();

router.route("/version")
  .get((req, res) => { res.json({ success: true, version: "agency api version 2.0" }) });

router.route("/payment")
  .all(authenticate)
  .get(PaymentCtrl2.handleLoadPayments)
  .post(PaymentCtrl2.handleCreatePayment)

router.route("/payment_callback")
  .post(PaymentCtrl2.handleProcessPayment)

router.route("/payment/:id")
  .all(authenticate)
  .get(PaymentCtrl2.handleGetPayment)
  .delete(PaymentCtrl2.handleCancelPayment)

router.route("/transaction")
  .all(authenticate)
  .get(TransactionCtrl2.handleLoadTransactions)

// Proxy related apis
router.route("/proxy")
  .all(authenticate)
  .get(ProxyCtrl2.handleLoadProxiesForAgency)
  .post(ProxyCtrl2.handleAppendProxiesForAgency)
  .put(ProxyCtrl2.handleUpdateProxiesForAgency)
  .delete(ProxyCtrl2.handleDeleteProxiesForAgency);

router.route("/proxy/:proxyId")
  .all(authenticate)
  .put(ProxyCtrl2.handleUpdateProxyForAdmin)
  .delete(ProxyCtrl2.handleDeleteProxyForAgency)

router.route("/chat")
  .all(authenticate)
  .get(ChatTeamCtrl2.handleLoadChatTeamsForAgency)
  .post(ChatTeamCtrl2.handleCreateChatTeamForAgency)
  .delete(ChatTeamCtrl2.handleDeleteChatTeamsForAgency)

router.route("/chat/:id")
  .all(authenticate)
  .put(ChatTeamCtrl2.handleUpdateChatTeamForAgency)
  .delete(ChatTeamCtrl2.handleDeleteChatTeamForAgency)

router.route("/model")
  .all(authenticate)
  .get(ModelCtrl2.handleLoadModelsForAgency)
  .post(ModelCtrl2.handleCreateModelForAgency)
  .put(ModelCtrl2.handleUpdateModelsForAgency)
  .delete(ModelCtrl2.handleDeleteModelsForAgency)

router.route("/model_list")
  .all(authenticate)
  .get(ModelCtrl2.handleLoadModelListForAgency)

router
  .route("/model/:modelId")
  .all(authenticate)
  .put(ModelCtrl2.handleUpdateModelForAgency)
  .delete(ModelCtrl2.handleDeleteModelForAgency);

router
  .route("/content/:modelId")
  .all(authenticate)
  .get(ModelCtrl2.handleGetContentsForAgency)
  .post(ModelCtrl2.handleAppendContentForAgency)
  .put(ModelCtrl2.handleUpdateContentsForAgency)
  .delete(ModelCtrl2.handleDeleteContentsForAgency);

router
  .route("/content/:modelId/:contentId")
  .all(authenticate)
  .put(ModelCtrl2.handleUpdateContentForAgency)
  .delete(ModelCtrl2.handleDeleteContentForAgency);

router
  .route("/account_list")
  .all(authenticate)
  .get(AccountCtrl2.handleLoadAccountList);

router
  .route("/account/:platform")
  .all(authenticate)
  .get(AccountCtrl2.handleLoadAccountsForAgency)
  .post(AccountCtrl2.handleCreateAccountForAgency)
  .put(AccountCtrl2.handleUpdateAccountsForAgency)
  .delete(AccountCtrl2.handleDeleteAccountsForAgency);

router
  .route("/account/:platform/:accountId")
  .all(authenticate)
  .put(AccountCtrl2.handleUpdateAccountForAgency)
  .delete(AccountCtrl2.handleDeleteAccountForAgency);

router
  .route("/history/:platform/:accountId")
  .all(authenticate)
  .get(HistoryCtrl2.handleLoadHistoryForAgency)
  .post(HistoryCtrl2.handleClearErrorForAgency)
  .delete(HistoryCtrl2.handleClearHistoryForAgency);

router
  .route("/schedule")
  .all(authenticate)
  .get(ScheduleCtrl2.handleLoadSchedulesForAgency)
  .post(ScheduleCtrl2.handleCreateScheduleForAgency)

router
  .route("/schedule/:scheduleId")
  .all(authenticate)
  .put(ScheduleCtrl2.handleUpdateScheduleForAgency)
  .delete(ScheduleCtrl2.handleDeleteScheduleForAgency);

router
  .route("/schedule_result")
  .all(authenticate)
  .get(ScheduleCtrl2.handleLoadScheduleResultsForAgency)

router
  .route("/schedule_result/:resultId")
  .all(authenticate)
  .put(ScheduleCtrl2.handleUpdateScheduleResultForAgency)
  .delete(ScheduleCtrl2.handleDeleteScheduleResultForAgency);

router.route("/stats")
  .all(authenticate)
  .get(DashboardCtrl2.handleGetStatsForAgency)

module.exports = router;