const mongoose = require("mongoose");
const { ScheduleStatus } = require("../config/const");
const { Schema, SchemaTypes } = mongoose;

const ScheduleResultSchema = new Schema({
  schedule: { type: SchemaTypes.ObjectId, ref: "Schedule" },
  account: { type: SchemaTypes.ObjectId, ref: "Account" },
  post: { type: String },
  status: { type: Number, default: ScheduleStatus.WAITING },
  reason: { type: String },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

ScheduleResultSchema.index({ owner: 1, scheduleAt: 1 });

const ScheduleResultModel = mongoose.model("ScheduleResult", ScheduleResultSchema);
module.exports = ScheduleResultModel;