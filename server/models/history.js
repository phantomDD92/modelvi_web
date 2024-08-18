const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;

const HistorySchema = new Schema({
  account: { type: SchemaTypes.ObjectId, ref: "Account", required: true },
  action: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

HistorySchema.index({ account: 1, createdAt: 1 });

const HistoryModel = mongoose.model("History", HistorySchema);
module.exports = HistoryModel;
