const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;

const ScheduleSchema = new Schema({
    actor: { type: SchemaTypes.ObjectId, ref: "Actor", required: true },    // model
    platform: { type: String, required: true },     // platform = "ALL" | "F2F" | "FNC"
    file: { type: String, required: true },        
    type: { type: Number, required: true },
    price: { type: Number },
    title: { type: String, required: true },
    folder: { type: String, required: true },
    description: { type: String },
    tags: [{ type: String }],
    scheduledAt: { type: Date, required: true },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
});

ScheduleSchema.index({ actor: 1, scheduleAt: 1 });
ScheduleSchema.index({ platform: 1, scheduleAt: 1 });

const ScheduleModel = mongoose.model("Schedule", ScheduleSchema);
module.exports = ScheduleModel;