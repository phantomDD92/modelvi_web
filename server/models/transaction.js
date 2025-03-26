const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;
require('./manager');
require('./account');

const TransactionSchema = new Schema({
  _id: { type: Number },
  agency: { type: SchemaTypes.ObjectId, ref: "Manager" },
  account: { type: SchemaTypes.ObjectId, ref: "Account" },
  amount: { type: Number },
  from: { type: Number },
  to: { type: Number },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const TransactionModel = mongoose.model("Transaction", TransactionSchema);

module.exports = TransactionModel;
