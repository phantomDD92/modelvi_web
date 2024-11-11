const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;

const UserSchema = new Schema({
  agency: { type: SchemaTypes.ObjectId, ref: "Manager" }, // comment owner
  alias: { type: String },
  status: { type: String },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.index({ agency:1, createdAt: 1});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
