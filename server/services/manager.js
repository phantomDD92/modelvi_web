const { AdminRole } = require("../config/const")
const ManagerModel = require("../models/manager")
const bcrypt = require('bcryptjs')
const { generateReferralCode } = require("../utils/helper")

const createAgency = ({ name, email, telegram, password }) =>
    ManagerModel.create({
        name,
        email,
        telegram,
        password: bcrypt.hashSync(password, 12),
        role: AdminRole.AGENCY,
        status: true,
        version: 2,
        referralCode: generateReferralCode(12),
    })

const findAgencyByName = (name) =>
    ManagerModel.findOne({ name }, 'name email password role status vip createdAt')

const findAgencyByEmail = (email) =>
    ManagerModel.findOne({ email }, 'name email password role status vip createdAt');

const loadAgencies = () =>
    ManagerModel.find({}, 'name email balance telegram role vip status createdAt');

const deleteAgency = (agencyId) =>
    ManagerModel.findByIdAndRemove(agencyId)

const findAgencyById = (id) => {
    return ManagerModel.findById(id, "name email role status balance vip createdAt");
}

const changeAgencyPassword = (id, password) => {
    return ManagerModel.findByIdAndUpdate(id, { $set: { password: bcrypt.hashSync(password, 12) } })
}

const changeAgencyStatus = (id, status) =>
    ManagerModel.findByIdAndUpdate(id, { $set: { status } })

const changeAgencyVIP = (id, vip) =>
    ManagerModel.findByIdAndUpdate(id, { $set: { vip } })

const changeAgency = (id, params) =>
    ManagerModel.findByIdAndUpdate(id, { $set: params })

const deleteBulkAgencies = (agencyIds) =>
    ManagerModel.deleteMany({ _id: { $in: agencyIds } });

const updateBulkAgenciesStatus = (agencyIds, status) =>
    ManagerModel.updateMany({ _id: { $in: agencyIds } }, { $set: { status } });

const ManagerService = {
    findAgencyByName,
    findAgencyByEmail,
    findAgencyById,
    loadAgencies,
    createAgency,
    deleteBulkAgencies,
    updateBulkAgenciesStatus,
    deleteAgency,
    changeAgencyPassword,
    changeAgencyStatus,
    changeAgency,
    changeAgencyVIP,
}

module.exports = ManagerService