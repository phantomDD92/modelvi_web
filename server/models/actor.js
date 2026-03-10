const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;
require('./account');

const ActorSchema = new Schema({
  number: { type: Number, required: true }, // model number
  name: { type: String, required: true }, // model name
  birthday: { type: Date }, // model name
  birthplace: { type: String }, // model name
  owner: { type: SchemaTypes.ObjectId, ref: "Manager" },
  accounts: [{ type: SchemaTypes.ObjectId, ref: "Account" }],
  contentsLength: { type: Number, default: 0 },
  contents: [{
    // image: String,
    folder: String,
    title: String,
    // tags: String,
    // story: Number,
    mode: String,
    platforms: [String],  // platform
    media: [{ name: String, mode: String, uuid: String, size: Number, }],  // photo or video
    preview: { name: String, mode: String, uuid: String, size: Number }, // preview video for fansly only
    postTags: [String],  // tags array
    knkyStoryType: Number,
    knkyStoryPrice: Number,
    f2fStoryType: Number,
    postTypes: { type: Schema.Types.Mixed, default: {} },
    price: { type: Number },
  }],
  updated: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ActorModel = mongoose.model("Actor", ActorSchema);
module.exports = ActorModel;
