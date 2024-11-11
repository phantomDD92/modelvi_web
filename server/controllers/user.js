const UserService = require("../services/user");
const { sendResult, sendError } = require("../utils/resp");

const handleLoadUsers = async (req, res) => {
  try {
    const users = await UserService.loadUsers(req.manager._id);
    sendResult(res, { users });
  } catch (error) {
    console.error(error);
    sendError(res, error);
  }
};

const handleCreateUser = async (req, res) => {
  try {
    const { alias, status } = req.body;
    if (status == "block")
      await UserService.createBlockUser(req.manager._id, alias);
    else if (status == "white")
      await UserService.createWhiteUser(req.manager._id, alias);
    sendResult(res);
  } catch (error) {
    console.error(error);
    sendError(res, error);
  }
};

const handleDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await UserService.deleteUser(id);
    sendResult(res);
  } catch (error) {
    console.error(error);
    sendError(res, error);
  }
};

const UserCtrl = {
  handleCreateUser,
  handleLoadUsers,
  handleDeleteUser
};

module.exports = UserCtrl;