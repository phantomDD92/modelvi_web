const CounterModel = require("../../models/counter");

const getNextSequence = async (name) => {
  const result = await CounterModel.findByIdAndUpdate(name, { $inc: { sequence: 1 } }, { new: true, upsert: true });
  return result.sequence;
}

const CounterService = {
  getNextSequence,
};

module.exports = CounterService;