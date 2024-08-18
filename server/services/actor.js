const ActorModel = require("../models/actor");

const createActor = ({
  number,
  name,
  birthday,
  height,
  weight,
  phone1,
  phone2,
  birthplace,
}) => ActorModel.create({
  number,
  name,
  birthday,
  height,
  weight,
  phone1,
  phone2,
  birthplace,
});


const updateActor = (
  id,
  { number, name, birthday, height, weight, phone1, phone2, birthplace }
) =>
  ActorModel.findByIdAndUpdate(id, {
    $set: {
      number,
      name,
      birthday,
      height,
      weight,
      phone1,
      phone2,
      birthplace,
    },
  });

const deleteActor = (id) => ActorModel.deleteOne({ _id: id });

const appendAccount = (id, account) =>
  ActorModel.findByIdAndUpdate(id, { $push: { accounts: account._id } });

const removeAccount = (id, account) => {
  ActorModel.findByIdAndUpdate(id, { $pullAll: { accounts: account._id } });
};

const loadActors = ({ page, pageSize }) =>
  Promise.all([
    ActorModel.find({})
      .sort("number")
      .skip((parseInt(page) - 1) * parseInt(pageSize))
      .limit(parseInt(pageSize))
      .populate("accounts", "platform alias"),
    ActorModel.countDocuments()
  ])

const loadAllActors = () =>
  ActorModel.find({}, "number name");

const findByNumber = (number) => ActorModel.findOne({ number });

const findByName = (name) => ActorModel.findOne({ name });

const findById = (id) => ActorModel.findById(id);

const getCount = () => ActorModel.countDocuments()

const setDiscord = (id, discord) => ActorModel.findByIdAndUpdate(id, { $set: { discord } });

const clearDiscord = (id) => ActorModel.findByIdAndUpdate(id, { $set: { discord: null } });

const appendContent = (id, { image, folder, title, tags }) =>
  ActorModel.findByIdAndUpdate(id, { $push: { contents: { image, folder, title, tags } }, $set: { updated: true } });

const deleteContent = (id, contentId) =>
  ActorModel.findByIdAndUpdate(id, { $pull: { contents: { _id: contentId } }, $set: { updated: true } })

const clearContents = (id) =>
  ActorModel.findByIdAndUpdate(id, { $set: { contents: [], updated: true } })

const syncContents = (id) =>
  ActorModel.findByIdAndUpdate(id, { $set: { updated: false } })

const ActorService = {
  createActor,
  updateActor,
  deleteActor,
  appendAccount,
  removeAccount,
  loadActors,
  findByName,
  findByNumber,
  findById,
  getCount,
  setDiscord,
  clearDiscord,
  appendContent,
  deleteContent,
  clearContents,
  syncContents,
  loadAllActors,
};

module.exports = ActorService;
