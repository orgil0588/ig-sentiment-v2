const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();

const crawler = require("./service/crawler");
const signal = require("./service/signal");
const savedSentiment = require("./service/savedDataCrawler");

const getLastSentimentData  =require('./routes/datas')
connectDB();

const port = process.env.PORT || 8001;

const filter = async () => {
  const date = new Date().getDay();

  if (date <= 5) {
    console.log(date, "date");
    const minutes = new Date().getMinutes();
    const seconds = new Date().getSeconds();
    console.log(minutes, seconds);
    await crawler(minutes);
    await signal(minutes);
  } else {
    console.log("amraltiin odor");
    return;
  }
};

filter();
setInterval(() => {
  const minutes = new Date().getMinutes();
  const seconds = new Date().getSeconds();
  console.log(`interval ${minutes}:${seconds}`);
  filter();
}, 300000);

setInterval(() => {
  savedSentiment();
}, 3600000);

app.use(express.json());

app.use(cors());
app.use("/api/v1/last-data", getLastSentimentData);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
