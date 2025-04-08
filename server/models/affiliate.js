const mongoose = require("mongoose");
const { Schema } = mongoose;

const AffiliateSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager', required: true },
  code: { type: String, unique: true, required: true },
  clicks: { type: Number, default: 0 },
  registrations: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
});


const AffiliateModel = mongoose.model("Affiliate", AffiliateSchema);
module.exports = AffiliateModel;
