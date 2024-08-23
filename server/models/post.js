const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;

const PostSchema = new Schema({
    actor: { type: SchemaTypes.ObjectId, ref: "Actor", required: true },    // model
    account: { type: SchemaTypes.ObjectId, ref: "Account", required: true },
    platform: { type: String, required: true },     // platform = "ALL" | "F2F" | "FNC"
    image: { type: String, required: true },
    folder: { type: String, required: true },
    description: { type: String },
    tags: [{ type: String }],
    type: { type: Number, required: true },
    price: { type: Number },
    scheduledAt: { type: Date },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
});

PostSchema.index({ account: 1, scheduleAt: 1 });
PostSchema.index({ actor: 1, scheduleAt: 1 });

const PostModel = mongoose.model("Post", PostSchema);
module.exports = PostModel;