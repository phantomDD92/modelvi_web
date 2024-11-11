const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;
require('./manager');

const CommentSchema = new Schema({
  agency: { type: SchemaTypes.ObjectId, ref: "Manager" }, // comment owner
  text: { type: String, required: true }, // comment text
  createdAt: { type: Date, default: Date.now }
});

const CommentModel = mongoose.model("Comment", CommentSchema);
module.exports = CommentModel;
