const PlatformModel = require("../models/platform")

const findPlatform = (name) => {
    return PlatformModel.findOne({name});
}

const updateSetting = (platform, captchaKey) => {
    return PlatformModel.findByIdAndUpdate(platform._id, {$set: { "bypass.CAPTCHA_API_KEY" : captchaKey}})
}
const PlatformService = {
    findPlatform,
    updateSetting
}

module.exports = PlatformService