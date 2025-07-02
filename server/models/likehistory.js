const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;

const LikeHistorySchema = new Schema({
  bot: { type: SchemaTypes.ObjectId, ref: "LikeBot", required: true },
  action: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

LikeHistorySchema.index({ account: 1, createdAt: 1 });

const LikeHistoryModel = mongoose.model("LikeHistory", LikeHistorySchema);
module.exports = LikeHistoryModel;
