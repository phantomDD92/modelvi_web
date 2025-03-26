const express = require("express");

const router = express.Router();

router.route("/version")
  .get((req, res) => { res.json({ success: true, version: "bot api version 2.0" }) });

module.exports = router;