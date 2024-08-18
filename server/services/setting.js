const SettingModel = require("../models/setting");

const getSetting = () => {
  return SettingModel.findById("setting");
};

const updateCaptchaKey = (key) =>
  SettingModel.findByIdAndUpdate("setting", { $set: { captcha: key } });

const SettingService = {
  getSetting,
  updateCaptchaKey,

};

module.exports = SettingService;
