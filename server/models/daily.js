const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;

const DailySchema = new Schema({
    account: { type: SchemaTypes.ObjectId, ref: "Account", required: true }, // account
    schedule: { type: SchemaTypes.ObjectId, ref: "Schedule", required: true }, // account
    file: { type: String },
    vault: { type: String },
    post: { type: String },
    finished: { type: Boolean, default: false },
    finishedAt: { type: Date },
    scheduledAt: { type: Date },
});

const DailyModel = mongoose.model("Daily", DailySchema);
module.exports = DailyModel;