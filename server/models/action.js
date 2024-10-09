const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;

const ActionSchema = new Schema({
  account: { type: SchemaTypes.ObjectId, ref: "Account" },
  target: { type: String },
  uuid: { type: String },
  action: { type: String },
  createdAt: { type: Date, default: Date.now },
});

ActionSchema.index({ account: 1, uuid: 1 });

const ActionModel = mongoose.model("Action", ActionSchema);
module.exports = ActionModel;
