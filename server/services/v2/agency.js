const ManagerModel = require("../../models/manager")

const updateBalance = (agencyId, amount) =>
  ManagerModel.findByIdAndUpdate(agencyId, { $inc: { balance: amount } })

const updateVip = (agencyId, vip) =>
  ManagerModel.findByIdAndUpdate(agencyId, { $set: { vip } })

const findAgencyById = (agencyId) =>
  ManagerModel.findById(agencyId);

const findAgencyByReferralCode = (referralCode) =>
  ManagerModel.findOne({ referralCode });

const getAgency = (agencyId) =>
  ManagerModel.findById(agencyId, "name email telegram role balance referralCode status vip verified");

const createAgency = ({ name, email, telegram, password }, referrer = undefined) =>
  ManagerModel.create({
    name,
    email,
    telegram,
    password: bcrypt.hashSync(password, 12),
    role: AdminRole.AGENCY,
    status: true,
    version: 2,
    referralCode: generateReferralCode(12),
    referrer,
  })

const findReferees = (agencyId) =>
  ManagerModel.find({ referrer: agencyId });

const setReferralCode = (agencyId, referralCode) =>
  ManagerModel.findByIdAndUpdate(agencyId, { $set: { referralCode } });

const AgencyService2 = {
  createAgency,
  findReferees,
  updateBalance,
  updateVip,
  findAgencyById,
  findAgencyByReferralCode,
  getAgency,
  setReferralCode,
}

module.exports = AgencyService2