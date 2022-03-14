const express = require("express");
const { crawler } = require("./src/raw-data/rawData.service");
const connectDB = require("./src/config/db");
const cors = require("cors");
const historyRoutes = require("./src/signal/signal.route");
// check week day
const app = express();

connectDB();
setInterval(() => {
  const filter = async () => {
    const date = new Date().getDay();
    if (date !== 6 && date !== 0) {
      crawler();
    } else {
      return 0;
    }
  };
  filter();
}, 300000);

app.use(express.json());
app.use(cors());
app.use("/api/v1/history", historyRoutes);

const server = app.listen(8001);
