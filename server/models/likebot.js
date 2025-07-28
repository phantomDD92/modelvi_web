const mongoose = require("mongoose");
require('./manager');

const LikeBotSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  alias: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  device: { type: String },
  proxy: { type: String },
  status: { type: Boolean, default: false },
  lastError: { type: String, default: '' },
  params: {},
  followings: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthday: { type: Date, },
  gender: { type: String },
  orientation: { type: String },
  role: { type: String },
  city: { type: String },
  registered: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const LikeBotModel = mongoose.model("LikeBot", LikeBotSchema);
module.exports = LikeBotModel;

