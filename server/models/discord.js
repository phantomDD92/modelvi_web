const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;

const DicordSchema = new Schema({
  url: { type: String, required: true },
  desc: {type:String},
  actors: [{ type: SchemaTypes.ObjectId, ref: 'Actor' }],
});

const DiscordModel = mongoose.model("Discord", DicordSchema);
module.exports = DiscordModel;
