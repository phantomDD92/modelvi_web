const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReferralSchema = new Schema({
  affiliateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Affiliate', required: true },
  referee: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager' },
  date: { type: Date, default: Date.now },
  earnings: { type: Number, default: 0 },
  converted: { type: Boolean, default: false },
});

const ReferralModel = mongoose.model("Referral", ReferralSchema);
module.exports = ReferralModel;
