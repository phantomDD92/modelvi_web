const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;

const PlatformSchema = new Schema({
  _id: { type: String },
  debug: { type: Boolean, default: false },
  accounts: [{ type: SchemaTypes.ObjectId }],
});

const PlatformModel = model("Platform", PlatformSchema);
module.exports = PlatformModel;
