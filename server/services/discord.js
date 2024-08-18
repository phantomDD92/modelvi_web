const DiscordModel = require("../models/discord");

const loadDiscords = ({ page, pageSize }) =>
  Promise.all([
    DiscordModel.find()
    .skip((parseInt(page) - 1) * parseInt(pageSize))
    .limit(parseInt(pageSize))
    .populate({
      path: "actors",
      select: "number name",
    }),
    DiscordModel.countDocuments()
  ])

const createDiscord = ({ url, desc }) => {
  return DiscordModel.create({ url, desc });
};

const updateDiscord = (id, { url, desc }) =>
  DiscordModel.findByIdAndUpdate(id, { $set: { url, desc } });


const deleteDiscord = (id) => {
  return DiscordModel.deleteOne({ _id: id });
};

const findByUrl = (url) =>
  DiscordModel.findOne({ url });


const appendActor = (id, actorId) => {
  return DiscordModel.findByIdAndUpdate(id, {
    $push: { actors: actorId },
  });
};

const removeActor = (id, actorId) =>
  DiscordModel.findByIdAndUpdate(id, { $pull: { actors: actorId } });

const getCount = () => DiscordModel.countDocuments()

const findById = (id) => DiscordModel.findById(id)

const DiscordService = {
  loadDiscords,
  createDiscord,
  deleteDiscord,
  updateDiscord,
  findByUrl,
  findById,
  appendActor,
  removeActor,
  getCount
};

module.exports = DiscordService;
