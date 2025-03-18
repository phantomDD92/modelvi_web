const bcryptjs = require('bcryptjs')
const { authenticator } = require('otplib');

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
    if (dupAgency || dupAgency.version > 1) {
      throw new ApiError(`Agency with ${name}, ${email} already exists`);
    }
    if (dupAgency) { // update agency
      await ManagerModel.findByIdAndUpdate(dupAgency._id, {
        $set: {
          name, email, telegram, password: bcryptjs.hashSync(password, 12), version: 2,
        }
      });
    } else {
      // create new agency
      await ManagerModel.create({
        name, email, telegram, password: bcryptjs.hashSync(password, 12), version: 2,
      })
    }
    const token = authenticator.generate(secret);
    console.log("OPT Token : ", token);
    sendResult(res);
  } catch (error) {
    sendError(res, error)
  }
}

const AgencyCtrlV2 = {
  handleRegisterAgency,
};

module.exports = AgencyCtrlV2