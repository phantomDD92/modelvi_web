const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;

const AccountSchema = new Schema({
  actor: { type: SchemaTypes.ObjectId, ref: "Actor", required: true },
  number: { type: Number, required: true },
  platform: { type: String, required: true },
  alias: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: Boolean, default: false },
  lastError: { type: String, default: '' },
  description: { type: String, default: '' },
  params: {},
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

AccountSchema.index({ platform: 1, number: 1 });

const AccountModel = mongoose.model("Account", AccountSchema);
module.exports = AccountModel;
