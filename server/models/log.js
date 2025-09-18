const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;

const LogSchema = new Schema({
    agency: { type: SchemaTypes.ObjectId, ref: "Account", required: true },
    model: { type: SchemaTypes.ObjectId, ref: "Account", required: true },
    account: { type: SchemaTypes.ObjectId, ref: "Account", required: true },
    action: { type: Number, required: true },
    success: { type: Boolean, required: true },
    log: { type: String, required: true },
    extra: {},
    createdAt: { type: Date, default: Date.now },
});

LogSchema.index({ createdAt: 1 });
LogSchema.index({ account: 1, createdAt: 1 });
LogSchema.index({ model: 1, createdAt: 1 });
LogSchema.index({ agency: 1, createdAt: 1 });

const LogModel = mongoose.model("Log", LogSchema);
module.exports = LogModel;
