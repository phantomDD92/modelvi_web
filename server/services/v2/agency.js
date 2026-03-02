const ManagerModel = require("../../models/manager")
const bcrypt = require('bcryptjs');

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

const loadAgenciesForAffiliate = () =>
  ManagerModel.find({}, "name email referrer commission referralCode")
    .populate("referrer", "name")

const loadAgencies = () =>
  ManagerModel.find({})
    .sort({ order: -1 })
    .populate("referrer", "name")

const deleteAgency = (agencyId) =>
  ManagerModel.findByIdAndDelete(agencyId)

const deleteAgencies = (agencyIds) =>
  ManagerModel.deleteMany({ _id: { $in: agencyIds } });

const changeStatus = (agencyId, status) =>
  ManagerModel.findByIdAndUpdate(agencyId, { $set: { status } });

const changeStatuses = (agencyIds, status) =>
  ManagerModel.updateMany({ _id: { $in: agencyIds } }, { $set: { status } });

const changePricePlans = (agencyId, pricePlans) =>
  ManagerModel.findByIdAndUpdate(agencyId, { $set: { pricePlans } });

const changePricePlanMode = (agencyId, mode) =>
  ManagerModel.findByIdAndUpdate(agencyId, { $set: { pricePlanMode: mode } });

const changeReferrer = (agencyId, referrer) =>
  ManagerModel.findByIdAndUpdate(agencyId, { $set: { referrer } });

const changeDueDate = (agencyId, dueDate) =>
  ManagerModel.findByIdAndUpdate(agencyId, { $set: { dueDate } });

const changeCommission = (agencyId, commission) =>
  ManagerModel.findByIdAndUpdate(agencyId, { $set: { commission } });

const getAgencyWithReferrer = (agencyId) =>
  ManagerModel.findById(agencyId, "name email role status balance referrer pricePlans createdAt")
    .populate("referrer", "commission")

const getAgencyList = () =>
  ManagerModel.find({}, "name");

const changePassword = (agencyId, password) =>
  ManagerModel.findByIdAndUpdate(agencyId, { $set: { password } });

const bulkWrite = (bulkOperations) =>
  ManagerModel.bulkWrite(bulkOperations)

const updateFee = (agencyId, fee) =>
  ManagerModel.findByIdAndUpdate(agencyId, { $set: { fee } });

const AgencyService2 = {
  createAgency,
  findReferees,
  updateBalance,
  updateVip,
  findAgencyById,
  findAgencyByReferralCode,
  getAgency,
  getAgencyWithReferrer,
  setReferralCode,
  loadAgenciesForAffiliate,
  loadAgencies,
  deleteAgency,
  deleteAgencies,
  changeStatus,
  changeStatuses,
  changePricePlans,
  changeReferrer,
  changeCommission,
  getAgencyList,
  changePassword,
  changePricePlanMode,
  changeDueDate,
  bulkWrite,
  updateFee,
}

module.exports = AgencyService2