const { AdminRole } = require("../config/const")
const ManagerModel = require("../models/manager")
const bcrypt = require('bcryptjs')

const createManager = (name, password) => {
    return ManagerModel.create({  name, password: bcrypt.hashSync(password, 12) })
}

const findByName = (name) => {
    return ManagerModel.findOne({ name })
}

const loadManagers = () => {
    return ManagerModel.find({role: AdminRole.NORMAL}, 'name createdAt');
}

const deleteManager = (id) => {
    return ManagerModel.deleteOne({_id: id})
}

const findById = (id) => {
    return ManagerModel.findById(id, "name role createdAt");
}

const changePassword = (id, password) => {
    return ManagerModel.findByIdAndUpdate(id, {$set : {password: bcrypt.hashSync(password, 12)}})
}
const ManagerService = {
    createManager,
    findByName,
    loadManagers,
    deleteManager,
    findById,
    changePassword
}

module.exports = ManagerService