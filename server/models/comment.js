const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommentSchema = new Schema({
  text: { type: String, required: true },
});

const CommentModel = mongoose.model("Comment", CommentSchema);
module.exports = CommentModel;
