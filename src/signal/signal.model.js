const mongoose = require("mongoose");

const CalculatedSchema = new mongoose.Schema({
  date: {
    type: String,
  },
  value: {
    type: Object,
  },
});

module.exports = mongoose.model("Calculated", CalculatedSchema);
