const UserModel = require("../models/user");

const createBlockUser = (agency, alias) =>
    UserModel.create({
        agency,
        alias,
        status: "block"
    });

const createWhiteUser = (agency, alias) =>
    UserModel.create({
        agency,
        alias,
        status: "white"
    });

const loadUsers = (agency) =>
    UserModel.find({ agency }).sort("-createdAt");

const deleteUser = (userId) =>
    UserModel.findByIdAndDelete(userId);

const UserService = {
    createBlockUser,
    createWhiteUser,
    loadUsers,
    deleteUser,
};

module.exports = UserService;