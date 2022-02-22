const express = require("express");
const router = express.Router();

const { getLastSentimentData  } = require("../controller/datas");

router.route("/").get(getLastSentimentData);


module.exports = router;
