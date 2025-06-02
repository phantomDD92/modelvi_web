const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;

const ChatTeamSchema = new Schema({
  discord: { type: String, required: true },
  name: { type: String, required: true },
  owner: { type: SchemaTypes.ObjectId, ref: "Manager" },
});

const ChatTeamModel = mongoose.model("ChatTeam", ChatTeamSchema);
module.exports = ChatTeamModel;
