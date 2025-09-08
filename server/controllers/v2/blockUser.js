
const BlockUserService2 = require("../../services/v2/blockUser");
const { sendResult, sendError } = require("../../utils/resp");

const handleLoadBlockUsersForAgency = async (req, res) => {
  try {
    const users = await BlockUserService2.loadAgencyBlockUsers(req.manager._id);
    sendResult(res, { users });
  } catch (error) {
    console.error(error);
    sendError(res, error);
  }
};

const handleAppendBlockUsersForAgency = async (req, res) => {
  try {
    const { users: newUsers } = req.body;
    await BlockUserService2.appendBlockUsers(req.manager._id, newUsers || []);
    const users = await BlockUserService2.loadAgencyBlockUsers(req.manager._id);
    sendResult(res, { users });
  } catch (error) {
    console.error(error);
    sendError(res, error);
  }
};

const handleDeleteBlockUserForAgency = async (req, res) => {
  try {
    const { userId } = req.params;
    await BlockUserService2.deleteBlockUser(userId);
    const users = await BlockUserService2.loadAgencyBlockUsers(req.manager._id);
    sendResult(res, { users });
  } catch (error) {
    console.error(error);
    sendError(res, error);
  }
};

const handleClearBlockUsersForAgency = async (req, res) => {
  try {
    await BlockUserService2.clearAgencyBlockUsers(req.manager._id)
    const users = await BlockUserService2.loadAgencyBlockUsers(req.manager._id);
    sendResult(res, { users });
  } catch (error) {
    console.error(error);
    sendError(res, error);
  }
};

const BlockUserCtrl2 = {
  handleLoadBlockUsersForAgency,
  handleAppendBlockUsersForAgency,
  handleClearBlockUsersForAgency,
  handleDeleteBlockUserForAgency,
};

module.exports = BlockUserCtrl2;
