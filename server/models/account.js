const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;
require('./actor');
require('./manager');
const AccountSchema = new Schema({
  actor: { type: SchemaTypes.ObjectId, ref: "Actor", required: true },
  number: { type: Number, required: true },
  platform: { type: String, required: true },
  alias: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  device: { type: String},
  status: { type: Boolean, default: false },
  lastError: { type: String, default: '' },
  description: { type: String, default: '' },
  params: {},
  owner: { type: SchemaTypes.ObjectId, ref: "Manager" },
  creator: { type: SchemaTypes.ObjectId, ref: "Manager" },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

AccountSchema.index({ platform: 1, number: 1 });

const AccountModel = mongoose.model("Account", AccountSchema);
module.exports = AccountModel;

// params for fnc
// contents : contents for account
//    uuid: vault id
//    storage: storage id
// uploaded : upload flag for contents
// storyNextTime : next story time
// storyInterval : story interval
// storyIndex: processing story Index
// storyMaxCount: max story items count
// storyReplaceCount: replace count
