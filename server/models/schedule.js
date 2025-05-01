const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;

const ScheduleSchema = new Schema({
    owner: { type: SchemaTypes.ObjectId, ref: "Manager" },
    account: { type: SchemaTypes.ObjectId, ref: "Account" },
    platform: { type: String },
    media: { type: String, required: true },
    preview: { type: String },
    title: { type: String, required: true },
    folder: { type: String },
    tags: [{ type: String }],
    type: { type: Number, required: true },
    price: { type: Number },
    fanPrice: { type: Number },
    scheduledAt: { type: Date, required: true },
    status: { type: Number },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
});

ScheduleSchema.index({ owner: 1, scheduleAt: 1 });
ScheduleSchema.index({ platform: 1, owner:1, scheduleAt: 1 });

const ScheduleModel = mongoose.model("Schedule", ScheduleSchema);
module.exports = ScheduleModel;