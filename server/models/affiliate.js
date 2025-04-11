const mongoose = require("mongoose");
const { Schema } = mongoose;

const AffiliateSchema = new Schema({
  referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager', required: true },
  referralCode: { type: String, unique: true, required: true },
  ipAddress: { type: String },
  attempted: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  clickedAt: { type: Date, default: Date.now },
  attemptedAt: { type: Date },
  completedAt: { type: Date },
});

AffiliateSchema.index({ referrer: 1 });

const AffiliateModel = mongoose.model("Affiliate", AffiliateSchema);
module.exports = AffiliateModel;
