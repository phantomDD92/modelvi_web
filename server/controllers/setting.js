const PlatformService = require("../services/platform")
const SettingService = require("../services/settings")

const handleLoadSetting = async (req, res) => {
    try {
        const platform = await PlatformService.findPlatform("FNC")
        const setting = await SettingService.getSetting(platform)
        res.json({ 
            success: true, 
            message: "Load Setting", 
            payload: { 
                headless : setting.BROWSER.VIEW_OPTION.headless,
                viewWidth: setting.BROWSER.CONTEXT_OPTION.viewport.width,
                viewHeight: setting.BROWSER.CONTEXT_OPTION.viewport.height,
                captchaKey: platform.bypass.CAPTCHA_API_KEY
            }
        })
    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}

const handleUpdateSetting = async(req, res) => {
    try {
        const { headless, viewWidth, viewHeight, captchaKey} = req.body
        const platform = await PlatformService.findPlatform("FNC");
        await SettingService.updateSetting(platform, {headless, viewWidth, viewHeight});
        await PlatformService.updateSetting(platform, captchaKey);
        res.json({ 
            success: true, 
            message: "Update Setting", 
            payload: { 
                headless,
                viewWidth,
                viewHeight,
                captchaKey
            }
        })
    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}

const SettingCtrl = {
    handleLoadSetting,
    handleUpdateSetting
}

module.exports = SettingCtrl