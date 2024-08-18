const mongoose = require("mongoose");
const { Protocol, Status } = require("../config/const");
const { Schema } = mongoose;

const ProxySchema = new Schema({
  url: { type: String, required: true },
  protocol: { type: String, default: Protocol.HTTP },
  status: { type: Boolean, default: true },
  expiredAt: { type: Date },
});

const ProxyModel = mongoose.model("Proxy", ProxySchema);
module.exports = ProxyModel;
