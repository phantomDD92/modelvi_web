const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;
require('./account');

const ActorSchema = new Schema({
  number: { type: Number, required: true }, // model number
  name: { type: String, required: true }, // model name
  avatar: { type: String },
  birthday: { type: Date },
  birthplace: { type: String },       // age
  height: { type: Number },
  weight: { type: Number },
  phone1: { type: String },
  phone2: { type: String },
  job: { type: String },
  study: { type: String },
  hobbies: [{ type: String }],
  relationship: { type: String },
  pets: { type: String },
  favorMusic: { type: String },
  favorFood: { type: String },
  description: { type: String },
  accounts: [{ type: SchemaTypes.ObjectId, ref: "Account" }],
  contents: [{
    image: String,
    folder: String,
    title: String,
    tags: String,
  }],
  updated: {type: Boolean, default: false},
  discord: {type: SchemaTypes.ObjectId, ref: "Discord" },
  createdAt: { type: Date, default: Date.now },
});

const ActorModel = mongoose.model("Actor", ActorSchema);
module.exports = ActorModel;
