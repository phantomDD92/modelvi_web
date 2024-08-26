const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;
require('./account');

const ActorSchema = new Schema({
  number: { type: Number, required: true }, // model number
  name: { type: String, required: true }, // model name
  profile : {
    avatar: { type: String },
    banner: { type: String },
    description: { type: String },
    plan1 : {
      title: {type: String},
      description: {type: String},
      price: {type: Number}, 
      discount: {type: Number},
      enabled: {type: Boolean},
      perks: [{type: String}]
    },
    plan2 : {
      title: {type: String},
      description: {type: String},
      price: {type: Number}, 
      discount: {type: Number},
      enabled: {type: Boolean},
      perks: [{type: String}]
    },
    plan3 : {
      title: {type: String},
      description: {type: String},
      price: {type: Number}, 
      discount: {type: Number},
      enabled: {type: Boolean},
      perks: [{type: String}]
    }
  },
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
