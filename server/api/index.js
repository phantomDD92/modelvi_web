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

const apiRouterV2 = require("./v2");

const router = express.Router();

router.route("/upload")
  .post(imageUpload.single('file'), (req, res) => { res.json({ file: req.file.filename }) })

router.use("/v2", apiRouterV2);

module.exports = router;
