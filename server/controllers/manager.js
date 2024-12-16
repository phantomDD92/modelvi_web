const jwt = require("jsonwebtoken");
const bcrypte = require("bcryptjs");
const ManagerService = require("../services/manager.js");
const dotenv = require("dotenv");
const { sendResult, sendError, ApiError } = require("../utils/resp.js");
const ActorService = require("../services/actor.js");
const { Platform, StoryType } = require("../config/const.js");
const AccountService = require("../services/account.js");

dotenv.config();

const handleCreateManager = async (req, res) => {
  try {
    const { name, password, ...params } = req.body;
    const agency = await ManagerService.findByName(name)
    if (agency)
      throw new ApiError(`Agency(${name}) is already existed`)
    if (password.length < 6)
      throw new ApiError("Password length is too short")
    await ManagerService.createManager({ name, password, ...params });
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleLoginManager = async (req, res) => {
  try {
    const { name, password } = req.body;
    const agency = await ManagerService.findAllByName(name)
    if (!agency)
      throw new ApiError(`Agency(${name}) is not registered`)
    const passwordCompare = await bcrypte.compare(password, agency.password);
    if (!passwordCompare)
      throw new ApiError("The password is incorrect");
    const token = jwt.sign({ id: agency._id }, process.env.SECRET_KEY || "SECRET_KEY_FNC", { expiresIn: "1h" });
    const auth = await ManagerService.findByName(name);
    sendResult(res, { token, auth })
  } catch (error) {
    sendError(res, error)
  }
};

const handleDeleteManager = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await ManagerService.findByName(name)
    if (!user)
      throw new Error(`Manager(${name}) is not found`)
    await ManagerService.deleteManager(user._id)
    const managers = await ManagerService.loadManagers()
    res.json({ success: true, message: "Delete Manager", payload: { managers } })
  } catch (error) {
    console.error(error)
    res.json({ success: false, message: error.message })
  }
}

const handleLoadManagers = async (req, res) => {
  try {
    const managers = await ManagerService.loadManagers()
    res.json({ success: true, message: "Load Managers", payload: { managers } })
  } catch (error) {
    console.error(error)
    res.json({ success: false, message: error.message })
  }
}

const handleChangePassword = async (req, res) => {
  try {
    const { name, password, newPassword } = req.body;
    const user = await ManagerService.findAllByName(name)
    if (!user)
      throw new Error(`Manager(${name}) is not registered`)
    const passwordCompare = await bcrypte.compare(password, user.password);
    if (!passwordCompare) {
      throw new Error("The old password is incorrect");
    }
    await ManagerService.changePassword(user._id, newPassword);
    res.json({ success: true, message: "Change Password" })
  } catch (error) {
    console.error(error)
    res.json({ success: false, message: error.message })
  }
}

const handleResetPassword = async (req, res) => {
  try {
    const { agency: agencyId, password } = req.body;
    const agency = await ManagerService.findById(agencyId)
    if (!agency)
      throw new Error(`The specified agency does not exist`)
    await ManagerService.changePassword(agencyId, password);
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
}

const handleReloadManager = async (req, res) => {
  try {
    sendResult(res, { auth: req.manager })
  } catch (error) {
    sendError(error);
  }
}

const handleChangeStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body;
    await ManagerService.changeStatus(id, status)
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};


const handleUpdateManager = async (req, res) => {
  try {
    const { id } = req.params
    const params = req.body;
    await ManagerService.updateManager(id, params)
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

/** Update Database */
const handleUpdateDB = async (req, res) => {
  try {
    // update actors content
    const actors = await ActorService.loadAll();
    for (let actor of actors) {
      const { contents } = actor;
      let newContents = [];
      for (let content of contents) {
        if (content.platforms.includes(Platform.FNC) && !content.platforms.includes(Platform.FNS)) {
          let newContent = content;
          let platforms = content.platforms;
          platforms.push(Platform.FNS);
          newContent.story = StoryType.PUBLIC
          newContent.platforms = platforms;
          newContents.push(newContent);
        } else {
          newContents.push(content);
        }
      }
      await ActorService.setContents(actor.id, newContents);
    }
    // update accounts content
    const accounts = await AccountService.loadAll(Platform.FNC);
    for (let account of accounts) {
      if (!account.params)
        continue;
      const { contents } = account.params;
      if (!contents)
        continue;
      let newContents = [];
      for (let content of contents) {
        let newContent = content;
        newContent.story = StoryType.PUBLIC;
        newContents.push(newContent);
      }
      await AccountService.replaceContents(account._id, newContents);
    }
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const ManagerCtrl = {
  handleCreateManager,
  handleLoginManager,
  handleDeleteManager,
  handleChangePassword,
  handleLoadManagers,
  handleReloadManager,
  handleChangeStatus,
  handleUpdateManager,
  handleResetPassword,
  handleUpdateDB
};

module.exports = ManagerCtrl;
