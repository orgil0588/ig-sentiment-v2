const mongoose = require("mongoose");

const SignalSchema = new mongoose.Schema({
  signal: {
    type: String,
  },
  date: {
    type: String,
  },
});

module.exports = mongoose.model("Signal", SignalSchema);
