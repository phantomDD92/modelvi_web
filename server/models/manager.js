const mongoose = require("mongoose");
const { SchemaTypes } = mongoose;
const { AdminRole } = require("../config/const");

const ManagerSchema = new mongoose.Schema({
  // profile-related field
  name: { type: String, required: true, trim: true }, // name
  email: { type: String, trim: true },   // email address
  password: { type: String, required: true }, // password
  telegram: { type: String }, // telegram id
  createdAt: { type: Date, default: Date.now },

  // payment-related fields
  balance: { type: Number, default: 0 },
  vip: { type: Boolean, default: false },

  // affiliate-related fields
  referralCode: { type: String },
  commission: { type: Number, default: 10 },
  referrer: { type: SchemaTypes.ObjectId, ref: "Manager" },

  pricePlans: {},
  // management-related fields
  role: { type: String, default: AdminRole.AGENCY },  // role : manager, agency
  version: { type: Number, default: 1 },
  status: { type: Boolean, default: true }, // status
  verified: { type: Boolean, default: false },

});

const ManagerModel = mongoose.model("Manager", ManagerSchema);
module.exports = ManagerModel;
