const mongoose = require("mongoose");
const { Protocol } = require("../config/const");
const { Schema, SchemaTypes } = mongoose;
require('./manager');

const ProxySchema = new Schema({
  url: { type: String, required: true },
  owner: { type: SchemaTypes.ObjectId, ref: "Manager" },
  protocol: { type: String, default: Protocol.HTTP },
  status: { type: Boolean, default: true },
  expiredAt: { type: Date },
});

const ProxyModel = mongoose.model("Proxy", ProxySchema);
module.exports = ProxyModel;
