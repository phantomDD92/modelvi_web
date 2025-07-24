const mongoose = require("mongoose");
const { Schema } = mongoose;
require('./manager');

const LikeCommentSchema = new Schema({
  text: { type: String, required: true }, // comment text
  createdAt: { type: Date, default: Date.now }
});

const LikeCommentModel = mongoose.model("LikeComment", LikeCommentSchema);
module.exports = LikeCommentModel;
