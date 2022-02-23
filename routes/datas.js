const express = require("express");
const router = express.Router();

const { getLastSentimentData  } = require("../controller/datas");
const { getSavedRawData } = require("../service/savedSignalCalc");

router.route("/").get(getLastSentimentData)
router.route('/chart').get(getSavedRawData)


module.exports = router;
