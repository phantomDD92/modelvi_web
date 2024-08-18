const mongoose = require("mongoose");
const { AdminRole } = require("../config/const");

const ManagerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, default: AdminRole.NORMAL },
  createdAt: { type: Date, default: Date.now },
});

const ManagerModel = mongoose.model("Manager", ManagerSchema);
module.exports = ManagerModel;
