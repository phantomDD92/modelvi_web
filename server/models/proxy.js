const mongoose = require("mongoose");
const { Protocol } = require("../config/const");
const { SchemaTypes } = mongoose;
require('./manager');

const ProxySchema = new mongoose.Schema({
  url: { type: String, required: true },
  owner: { type: SchemaTypes.ObjectId, ref: "Manager" },
  protocol: { type: String, default: Protocol.HTTP },
  status: { type: Boolean, default: true },
  usage : {},
  expiredAt: { type: Date },
});

const ProxyModel = mongoose.model("Proxy", ProxySchema);
module.exports = ProxyModel;
