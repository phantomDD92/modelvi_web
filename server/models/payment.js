const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;
require('./manager');
require('./account');

const PaymentSchema = new Schema({
  _id: { type: Number },
  agency: { type: SchemaTypes.ObjectId, ref: "Manager" },
  paymentId: { type: String },
  network: { type: String },
  payAddress: { type: String },
  payCurrency: { type: String },
  payAmount: { type: Number },
  paidAmount: { type: Number, default: 0 },
  priceCurrency: { type: String },
  priceAmount: { type: Number },
  outcomeAmount: { type: Number, default: 0 },
  description: { type: String },
  status: { type: String },
  createdAt: { type: Date, default: Date.now },
  expiredAt: { type: Date, default: Date.now },
});

const PaymentModel = mongoose.model("Payment", PaymentSchema);

module.exports = PaymentModel;
