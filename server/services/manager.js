const { AdminRole } = require("../config/const")
const ManagerModel = require("../models/manager")
const bcrypt = require('bcryptjs')

const createManager = ({ name, password, maxActors, maxAccounts, email }) =>
    ManagerModel.create({
        name,
        email,
        password: bcrypt.hashSync(password, 12),
        maxAccounts,
        maxActors,
        role: AdminRole.AGENCY,
        status: true,
    })


const findByName = (name) =>
    ManagerModel.findOne({ name }, 'name email role status maxAccounts maxActors createdAt')

const findAllByName = (name) =>
    ManagerModel.findOne({ name })

const loadManagers = () =>
    ManagerModel.find({ role: AdminRole.AGENCY }, 'name email maxAccounts maxActors role status createdAt');


const deleteManager = (id) => {
    return ManagerModel.deleteOne({ _id: id })
}

const findById = (id) => {
    return ManagerModel.findById(id, "name email role status maxAccounts maxActors createdAt");
}

const changePassword = (id, password) => {
    return ManagerModel.findByIdAndUpdate(id, { $set: { password: bcrypt.hashSync(password, 12) } })
}

const changeStatus = (id, status) =>
    ManagerModel.findByIdAndUpdate(id, { $set: { status } })

const updateManager = (id, params) =>
    ManagerModel.findByIdAndUpdate(id, { $set: params })

const ManagerService = {
    createManager,
    findByName,
    findAllByName,
    loadManagers,
    deleteManager,
    findById,
    changePassword,
    changeStatus,
    updateManager
}

module.exports = ManagerService