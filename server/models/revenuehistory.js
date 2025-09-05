const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;

const RevenueHistorySchema = new Schema({
  agency: { type: SchemaTypes.ObjectId, ref: "Manager", required: true },
  model: { type: SchemaTypes.ObjectId, ref: "Actor", required: true },
  account: { type: SchemaTypes.ObjectId, ref: "Account", required: true },
  platform: { type: String },
  time: { type: String, required: true },
  revenue: { type: Number, },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

RevenueHistorySchema.index({ account: 1, createdAt: 1 });

const RevenueHistoryModel = mongoose.model("RevenueHistory", RevenueHistorySchema);
module.exports = RevenueHistoryModel;
