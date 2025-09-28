const mongoose = require("mongoose");
const { PostType } = require("../config/const");
const { Schema, SchemaTypes } = mongoose;

const ScheduleSchema = new Schema({
    owner: { type: SchemaTypes.ObjectId, ref: "Manager" },
    actor: { type: SchemaTypes.ObjectId, ref: "Actor" },
    media: { name: String, mode: String },
    medias: [{ name: String, mode: String }],
    preview: { name: String, mode: String },
    title: { type: String, required: true },
    folder: { type: String },
    tags: [{ type: String }],
    type: { type: Number, required: true, default: PostType.FREE },
    price: { type: Number },
    results: [{ type: SchemaTypes.ObjectId, ref: "ScheduleResult" }],
    scheduledAt: { type: Date, required: true },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
});

ScheduleSchema.index({ owner: 1, scheduleAt: 1 });

const ScheduleModel = mongoose.model("Schedule", ScheduleSchema);
module.exports = ScheduleModel;