const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;

const LogSchema = new Schema({
    agency: { type: SchemaTypes.ObjectId, ref: "Account", required: true },
    model: { type: SchemaTypes.ObjectId, ref: "Account", required: true },
    account: { type: SchemaTypes.ObjectId, ref: "Account", required: true },
    action: { type: Number, required: true },
    success: { type: Boolean, required: true },
    message: { type: String },
    disabled: { type: Boolean },
    notified: { type: Boolean },
    error: { type: String },
    target: { type: String },
    targets: [{ type: String }],
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
});

LogSchema.index({ createdAt: 1 });
LogSchema.index({ account: 1, createdAt: 1 });
LogSchema.index({ model: 1, createdAt: 1 });
LogSchema.index({ agency: 1, createdAt: 1 });

const LogModel = mongoose.model("Log", LogSchema);
module.exports = LogModel;
