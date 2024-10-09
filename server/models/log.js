const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;

const LogSchema = new Schema({
  platform: {type: String},
  alias: {type: String},
  level: { type: Number },
  message: { type: String },
  stack: { type: String },
  createdAt: { type: Date, default: Date.now },
});

LogSchema.index({ createdAt: 1 });
LogSchema.index({ platform: 1, createdAt: 1 });
LogSchema.index({ platform: 1, level:1, createdAt: 1 });
LogSchema.index({ platform: 1, alias:1, createdAt: 1 });
LogSchema.index({ platform: 1, alias: 1, level: 1, createdAt: 1 });

const LogModel = mongoose.model("Log", LogSchema);
module.exports = LogModel;
