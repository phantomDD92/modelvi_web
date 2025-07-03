const mongoose = require("mongoose");
require('./manager');

const ProxyNewSchema = new mongoose.Schema({
  url: { type: String, required: true },
  status: { type: Boolean, default: true },
});

const ProxyNewModel = mongoose.model("ProxyNew", ProxyNewSchema);
module.exports = ProxyNewModel;
