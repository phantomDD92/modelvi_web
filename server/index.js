const express = require("express");
const cors = require("cors");
const path = require('path')
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const db = require("./config/db");

const apiRouter = require("./api");
const botRouter = require("./bot/api");
dotenv.config();

const app = express();
const buildPath = path.join(__dirname, 'client')
app.set('trust proxy', true);
app.use(express.static(buildPath));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(bodyParser.json({ limit: "1000mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "1000mb", extended: true }));
app.use(cors());

app.use("/api", apiRouter)
app.use("/bot", botRouter)
app.get('/capitalist_9585c66ba8.txt', (req, res) => {
  res.sendFile(path.join(buildPath, 'capitalist_9585c66ba8.txt'))
})

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'))
})

db();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("server is running", PORT);
});


