const express = require("express");
const PaymentCtrl = require("../../controllers/v2/payment");
const authenticate = require("../../middleware/auth");
const TransactionCtrl = require("../../controllers/v2/transaction");
const ProxyCtrl2 = require("../../controllers/v2/proxy");

const router = express.Router();

router.route("/version")
  .get((req, res) => { res.json({ success: true, version: "agency api version 2.0" }) });

router.route("/payment")
  .all(authenticate)
  .get(PaymentCtrl.handleLoadPayments)
  .post(PaymentCtrl.handleCreatePayment)

router.route("/payment_callback")
  .post(PaymentCtrl.handleProcessPayment)

router.route("/payment/:id")
  .all(authenticate)
  .get(PaymentCtrl.handleGetPayment)
  .delete(PaymentCtrl.handleCancelPayment)

router.route("/transaction")
  .all(authenticate)
  .get(TransactionCtrl.handleLoadTransactions)

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
  
module.exports = router;