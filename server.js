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

const port = process.env.PORT || 8080;

crawler();
setTimeout(() => {
  signal();
}, 300000);

setInterval(() => {
  crawler();
}, 3600000);

setInterval(() => {
  signal();
}, 3900000);

app.use(express.json());

app.use(cors());

// crawler()

// app.use("/api/v1", dataRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
