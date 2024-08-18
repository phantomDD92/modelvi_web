const mongoose = require("mongoose");
const { Schema } = mongoose;

const SettingSchema = new Schema({
  _id: { type: String },
  captcha: { type: String },
});

const SettingModel = mongoose.model("Setting", SettingSchema);
module.exports = SettingModel;
