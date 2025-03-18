const mongoose = require("mongoose");
const { AdminRole } = require("../config/const");

const ManagerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, // name
  email: { type: String, trim: true },   // email address
  password: { type: String, required: true }, // password
  telegram: { type: String }, // telegram id
  role: { type: String, default: AdminRole.AGENCY },  // role : manager, agency
  maxActors: { type: Number, default: 3 }, // max model count
  maxAccounts: { type: Number, default: 3 }, // max account count
  version: { type: Number, default: 1 },
  status: { type: Boolean, default: true }, // status
  createdAt: { type: Date, default: Date.now },
});

const ManagerModel = mongoose.model("Manager", ManagerSchema);
module.exports = ManagerModel;
