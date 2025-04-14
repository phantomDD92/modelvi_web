const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const nodemailer = require('nodemailer');
const ManagerService = require("../services/manager.js");
const dotenv = require("dotenv");
const { sendResult, sendError, ApiError } = require("../utils/resp.js");
const ActorService = require("../services/actor.js");
const AccountService = require("../services/account.js");
const ActorModel = require("../models/actor.js");
const NotifyUtils = require("../utils/notifiy.js");

dotenv.config();

const handleCreateAgency = async (req, res) => {
  try {
    const { name, password, ...params } = req.body;
    const agency = await ManagerService.findAgencyByName(name)
    if (agency)
      throw new ApiError(`The agency(${name}) is already existed`)
    if (password.length < 6)
      throw new ApiError("Password length is too short")
    await ManagerService.createAgency({ name, password, ...params });
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleLoginManager = async (req, res) => {
  try {
    const { name, password } = req.body;
    const agency = await ManagerService.findAgencyByName(name)
    if (!agency)
      throw new ApiError(`Agency(${name}) is not registered`)
    const passwordCompare = await bcryptjs.compare(password, agency.password);
    if (!passwordCompare)
      throw new ApiError("The password is incorrect");
    const token = jwt.sign({ id: agency._id }, process.env.SECRET_KEY || "SECRET_KEY_FNC", { expiresIn: "1h" });
    const auth = await ManagerService.findAgencyByName(name);
    sendResult(res, { token, auth })
  } catch (error) {
    sendError(res, error)
  }
};

const handleDeleteAgency = async (req, res) => {
  try {
    const { id: agencyId } = req.params;
    const agency = await ManagerService.findAgencyById(agencyId)
    if (!agency)
      throw new ApiError(`The agency is not found`)
    await ManagerService.deleteAgency(agencyId)
    sendResult(res);
  } catch (error) {
    console.error(error)
    sendError(res, error);
  }
}

const handleUpdateBulkAgencies = async (req, res) => {
  try {
    const { action, agencyIds, ...params } = req.body;
    switch (action) {
      case 'status':
        const { status } = params;
        await ManagerService.updateBulkAgenciesStatus(agencyIds, status);
        break;
      default:
        throw new ApiError("Invalid operation");
    }
    sendResult(res);
  } catch (error) {
    console.error(error)
    sendError(res, error);
  }
}

const handleDeleteBulkAgencies = async (req, res) => {
  try {
    const { agencyIds } = req.body;
    await ManagerService.deleteBulkAgencies(agencyIds)
    sendResult(res);
  } catch (error) {
    console.error(error)
    sendError(res, error);
  }
}

const handleLoadAgencies = async (req, res) => {
  try {
    const managers = await ManagerService.loadAgencies();
    const modelStats = await ActorService.getStats();
    const accountStats = await AccountService.getStats();
    const feeStats = await AccountService.getFeeStats();
    sendResult(res, { managers, modelStats, accountStats, feeStats });
  } catch (error) {
    console.error(error)
    sendError(res, error);
  }
}

const handleChangePassword = async (req, res) => {
  try {
    const { name, password, newPassword } = req.body;
    const user = await ManagerService.findAgencyByName(name)
    if (!user)
      throw new ApiError(`Agency(${name}) is not registered`)
    const passwordCompare = await bcryptjs.compare(password, user.password);
    if (!passwordCompare)
      throw new ApiError("The old password is incorrect");
    await ManagerService.changeAgencyPassword(user._id, newPassword);
    sendResult(res);
  } catch (error) {
    console.error(error)
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

const handleUpdateAgency = async (req, res) => {
  try {
    const { id: agencyId } = req.params
    const { action, ...params } = req.body;
    switch (action) {
      case "change":
        await ManagerService.changeAgency(agencyId, params)
        break;
      case "status":
        const { status } = params;
        await ManagerService.changeAgencyStatus(agencyId, status);
        break;
      case "vip":
        const { vip } = params;
        await ManagerService.changeAgencyVIP(agencyId, vip);
        break;
      case "password":
        const { password } = params;
        await ManagerService.changeAgencyPassword(agencyId, password);
        break;
      default:
        throw new ApiError("Invalid operation");
    }
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
      const contents = actor.contents || [];
      await ActorModel.findByIdAndUpdate(actor._id, { $set: { contentsLength: contents.length } })
    }
    sendResult(res);
  } catch (error) {
    sendError(res, error);
  }
};

const handleSendContact = async (req, res) => {
  try {
    const { name, email, message, subject } = req.body;
    if (!name || !email || !message || !subject)
      throw new ApiError("All fields are required");
    const htmlContent = message.split("\n").map(p => `<p>${p.replace(/\n/g, '')}</p>`).join('') + `<br><p>From <b>${name}</b></p>`;
    await NotifyUtils.sendContactMail(email, subject, htmlContent)
    sendResult(res);
  } catch (error) {
    sendError(res, error)
  }
}


const ManagerCtrl = {
  handleCreateAgency,
  handleDeleteAgency,
  handleDeleteBulkAgencies,
  handleChangePassword,
  handleLoadAgencies,
  handleReloadManager,
  handleUpdateAgency,
  handleUpdateBulkAgencies,
  handleUpdateDB,
  handleSendContact,
  // Auth related routes
  handleLoginManager,
  // handleUpdateAgency,
  // handleLoginAgency,
  // handleLoginAgency,
};

module.exports = ManagerCtrl;
