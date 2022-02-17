const mongoose = require("mongoose");

const SavedSentiment = new mongoose.Schema({
  pair: {
    type: String,
  },
  long: {
    type: String,
  },
  date: {
    type: String,
  },
  index: {
    type: Number,
  },
});

module.exports = mongoose.model("SavedSentiment", SavedSentiment);
