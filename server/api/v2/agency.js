const express = require("express");
const PaymentCtrl = require("../../controllers/v2/payment");
const authenticate = require("../../middleware/auth");
const TransactionCtrl = require("../../controllers/v2/transaction");

const router = express.Router();

router.route("/version")
  .get((req, res) => { res.json({ success: true, version: "agency api version 2.0" }) });

router.route("/payment")
  .all(authenticate)
  .get(PaymentCtrl.handleLoadPayments)
  .post(PaymentCtrl.handleCreatePayment)

router.route("/payment/:id")
  .all(authenticate)
  .get(PaymentCtrl.handleGetPayment)
  .delete(PaymentCtrl.handleCancelPayment)

router.route("/transaction")
  .all(authenticate)
  .get(TransactionCtrl.handleLoadTransactions)

module.exports = router;