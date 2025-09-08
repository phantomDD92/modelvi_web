const UserModel = require("../../models/user");

const loadAgencyBlockUsers = (agencyId) =>
  UserModel.find({ agency: agencyId }).sort("-createdAt");

const appendBlockUsers = (agencyId, users) =>
  UserModel.bulkWrite(
    users.map(alias => ({
      insertOne: {
        document: {
          agency: agencyId,
          alias,
        }
      }
    }))
  );

const deleteBlockUser = (userId) =>
  UserModel.findByIdAndDelete(userId);

const clearAgencyBlockUsers = (agencyId) =>
  UserModel.deleteMany({ agency: agencyId });

const loadBlockUsers = ({ agency, search }) => {
  const agencyQuery = agency && agency != "" ? { agency } : {};
  const searchQuery = search && search != ""
    ? { alias: { $regex: search, $options: "i" } }
    : {}
  const query = {
    ...agencyQuery,
    ...searchQuery,
  }
  return UserModel.find(query)
    .sort({ agency: 1 })
    .populate("agency", "name");
}

const BlockUserService2 = {
  loadAgencyBlockUsers,
  loadBlockUsers,
  appendBlockUsers,
  clearAgencyBlockUsers,
  deleteBlockUser
};

module.exports = BlockUserService2;