const mongoose = require("mongoose");

const RawDataSchema = new mongoose.Schema({
  pair: String,
  date: String,
  long: String,
  index: Number,
});

module.exports = mongoose.model("RawData", RawDataSchema);
