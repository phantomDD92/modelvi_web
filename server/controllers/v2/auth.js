const bcryptjs = require('bcryptjs')
// const { authenticator } = require('otplib');
const jwt = require('jsonwebtoken');

const ManagerModel = require("../../models/manager");
const { sendError, sendResult, ApiError } = require("../../utils/resp");
const ProxyService2 = require('../../services/v2/proxy');
const ModelService2 = require('../../services/v2/model');
const AccountService2 = require('../../services/v2/account');

const handleRegisterAgency = async (req, res) => {
  try {
    const { name, email, telegram, password } = req.body;
    // first check if duplicated one already exists
    let dupAgency = await ManagerModel.findOne({ email }, 'name email version')
    if (!dupAgency) {
      dupAgency = await ManagerModel.findOne({ name }, 'name email version')
    }
    if (dupAgency && dupAgency.version > 1) {
      throw new ApiError(`Agency with ${name}, ${email} already exists`);
    }
    if (dupAgency) { // update agency
      await ManagerModel.findByIdAndUpdate(dupAgency._id, {
        $set: {
          name, email, telegram, password: bcryptjs.hashSync(password, 12), version: 2, verified: false,
        }
      });
    } else {
      // create new agency
      await ManagerModel.create({
        name, email, telegram, password: bcryptjs.hashSync(password, 12), version: 2, verified: false,
      })
    }
    sendResult(res);
  } catch (error) {
    sendError(res, error)
  }
}

const handleLoginAgency = async (req, res) => {
  try {
    const { email, password } = req.body;
    let agency;
    if (email.includes("@"))
      agency = await ManagerModel.findOne({ email }, "password status role name");
    else
      agency = await ManagerModel.findOne({ name: email }, "password status role name");
    if (!agency)
      throw new ApiError(`Agency(${email}) is not registerd`);
    const passwordCompare = await bcryptjs.compare(password, agency.password);
    if (!passwordCompare)
      throw new ApiError("Password is incorrect");
    const token = jwt.sign({ id: agency._id, role: agency.role, name: agency.name }, process.env.SECRET_KEY || "SECRET_KEY_MODELVI", { expiresIn: "1d" });
    const profile = await ManagerModel.findById(agency._id, "name email telegram role balance status verified maxAccounts maxActors");
    const profileJson = profile.toJSON();
    const proxyCount = await ProxyService2.getAgencyProxyCount(req.manager._id);
    const modelCount = await ModelService2.getAgencyModelCount(req.manager._id);
    const accounts = await AccountService2.findAgencyAccounts(req.manager._id);
    sendResult(res, { token, profile: { ...profileJson, proxyCount, modelCount, accountCount: accounts.length } });
  } catch (error) {
    sendError(res, error)
  }
}

const handleGetProfile = async (req, res) => {
  try {
    const proxyCount = await ProxyService2.getAgencyProxyCount(req.manager._id);
    const modelCount = await ModelService2.getAgencyModelCount(req.manager._id);
    const accounts = await AccountService2.findAgencyAccounts(req.manager._id);
    let monthlyFee = 0;
    for (account of accounts) {
      monthlyFee += (account.fee || 50);
    }
    sendResult(res, { profile: { ...req.manager, proxyCount, modelCount, accountCount: accounts.length, monthlyFee } })
  } catch (error) {
    sendError(res, error);
  }
}

const AuthCtrl = {
  handleRegisterAgency,
  handleLoginAgency,
  handleGetProfile,
};

module.exports = AuthCtrl