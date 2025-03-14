const mongoose = require('mongoose');

// Counter schema
const counterSchema = new mongoose.Schema({
  _id: String, // Collection name for which counter is used
  sequence: { type: Number, default: 0 }
});

const CounterModel = mongoose.model('Counter', counterSchema);

module.exports = CounterModel;