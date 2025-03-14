const mongoose = require("mongoose");
const CounterModel = require("./counter");
const { Schema, SchemaTypes } = mongoose;
require('./manager');
require('./account');

const TransactionSchema = new Schema({
  _id: { type: Number },
  agency: { type: SchemaTypes.ObjectId, ref: "Manager" },
  amount: { type: Number },
  from: { type: Number },
  to: { type: Number },
  description: { type: String },
  direction: { type: Number },
  account: { type: SchemaTypes.ObjectId, ref: "Account" },
  createdAt: { type: Date, default: Date.now },
});

TransactionSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      // Get the latest counter value for this model
      const counter = await CounterModel.findOneAndUpdate(
        { _id: 'user' }, // You can use a different string for different collections
        { $inc: { sequence: 1 } },
        { new: true, upsert: true } // `upsert: true` will create the counter if it doesn't exist
      );

      // Assign the auto-incremented _id from the counter
      this._id = counter.sequence_value;

      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

const TransactionModel = mongoose.model("Transaction", TransactionSchema);

module.exports = TransactionModel;
