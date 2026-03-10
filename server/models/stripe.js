const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;
require('./manager');
require('./account');

const StripeSchema = new Schema({
    _id: { type: Number },
    agency: { type: SchemaTypes.ObjectId, ref: "Manager" },
    paymentId: { type: String },
    amount: { type: Number },
    clientSecret: { type: String },
    currency: { type: String },
    status: { type: String },
    extra: {},
    createdAt: { type: Date, default: Date.now },
    expiredAt: { type: Date, default: Date.now },
});

const StripeModel = mongoose.model("Stripe", StripeSchema);

module.exports = StripeModel;
