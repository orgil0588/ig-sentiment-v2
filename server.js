const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
// const dataRoutes = require("./routes/datas");
const app = express();

const crawler = require("./service/crawler");
const signal = require("./service/signal");
// const { getLastSentimentData, getAllData } = require("../controller/datas.js");
connectDB();

const port = process.env.PORT || 8001;

const filter = async () => {
  const date = new Date().getDay();
  if (date <= 5) {
    const minutes = new Date().getMinutes();
    await crawler(minutes);
    await signal(minutes);
  } else {
    console.log("amraltiin odor");
    return;
  }
};

filter();

// setTimeout(async () => {
//   await crawler();
//   await signal();
// }, 1000);

// setInterval(async () => {
//   await crawler();
//   await signal();
// }, 3600000);

app.use(express.json());

app.use(cors());

// crawler()

// app.use("/api/v1", dataRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
