const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;

const ChatTeamSchema = new Schema({
  discord: { type: String, required: true },
  name: { type: String, required: true },
  accounts: [{ type: SchemaTypes.ObjectId, ref: 'Account' }],
});

const ChatTeamModel = mongoose.model("ChatTeam", ChatTeamSchema);
module.exports = ChatTeamModel;
