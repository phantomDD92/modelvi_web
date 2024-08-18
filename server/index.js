const express = require("express");
const cors = require("cors");
const path = require('path')
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const db = require("./config/db");

const apiRouter = require("./api");
dotenv.config();

const app = express();
const buildPath = path.join(__dirname, 'client')
app.use(express.static(buildPath));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/api", apiRouter)
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'))
})

db();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("server is running", PORT);
});


