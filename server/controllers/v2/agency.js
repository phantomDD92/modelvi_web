const bcryptjs = require('bcryptjs')
const { authenticator } = require('otplib');
const jwt = require('jsonwebtoken');

const ManagerModel = require("../../models/manager");
const { sendError, sendResult, ApiError } = require("../../utils/resp");

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
    const agency = await ManagerModel.findOne({ email }, "password status role name");
    if (!agency)
      throw new ApiError(`Agency(${email}) is not registerd`);
    const passwordCompare = await bcryptjs.compare(password, agency.password);
    if (!passwordCompare)
      throw new ApiError("Password is incorrect");
    const token = jwt.sign({ id: agency._id, role: agency.role, name: agency.name }, process.env.SECRET_KEY || "SECRET_KEY_MODELVI", { expiresIn: "1d" });
    const auth = await ManagerModel.findById(agency._id, "name email telegram role status verified maxAccounts maxActors")
    sendResult(res, { token, auth });
  } catch (error) {
    sendError(res, error)
  }
}

const handleRefreshToken = async (req, res) => {
  try {
    sendResult(res, { auth: req.manager })
  } catch (error) {
    sendError(res, error);
  }
}

const AgencyCtrlV2 = {
  handleRegisterAgency,
  handleLoginAgency,
  handleRefreshToken,
};

module.exports = AgencyCtrlV2