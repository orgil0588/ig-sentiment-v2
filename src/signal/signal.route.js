const express = require("express");
const router = express.Router();

const { getHistory } = require("./signal.controller");

// api/v1/history

router.route("/").get(getHistory);

module.exports = router;
