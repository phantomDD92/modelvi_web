const mongoose = require("mongoose");
require('./manager');

const LikeBotSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  alias: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: Boolean, default: false },

  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthday: { type: Date, },
  gender: { type: String },
  registered: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

const LikeBotModel = mongoose.model("LikeBot", LikeBotSchema);
module.exports = LikeBotModel;

