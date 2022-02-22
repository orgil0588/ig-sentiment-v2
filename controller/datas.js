const savedSentiment = require("../models/SavedSentiment");
const asyncHandler = require("express-async-handler");

exports.getLastSentimentData = asyncHandler(async (req, res) => {
  const data = await savedSentiment.find().sort({ _id: -1 }).limit(28);
  const getLastSentimentRaw = await savedSentiment
    .find()
    .sort({ _id: -1 })
    .limit(28)
    .select("pair long -_id");

  const left = [];
  const right = [];
  data.forEach((e) => {
    left.push({
      pair: e.pair.split("-")[0],
      value: parseInt(e.long) - 50,
    });
    right.push({
      pair: e.pair.split("-")[1],
      value: 50 - parseInt(e.long),
    });
  });

  let merge = [...left, ...right];

  let aud = [];
  let cad = [];
  let jpy = [];
  let chf = [];
  let usd = [];
  let eur = [];
  let gbp = [];
  let nzd = [];

  merge.forEach((e, i) => {
    switch (e.pair) {
      case "aud":
        aud.push(e.value);
        break;
      case "cad":
        cad.push(e.value);
        break;
      case "jpy":
        jpy.push(e.value);
        break;
      case "chf":
        chf.push(e.value);
        break;
      case "usd":
        usd.push(e.value);
        break;

      case "eur":
        eur.push(e.value);
        break;

      case "gbp":
        gbp.push(e.value);
        break;
      case "nzd":
        nzd.push(e.value);
        break;
    }
  });

  let audDummy = 0;
  let cadDummy = 0;
  let jpyDummy = 0;
  let chfDummy = 0;
  let usdDummy = 0;
  let eurDummy = 0;
  let gbpDummy = 0;
  let nzdDummy = 0;

  for (let i = 0; i <= aud.length - 1; i++) {
    audDummy += aud[i];
  }
  for (let i = 0; i <= cad.length - 1; i++) {
    cadDummy += cad[i];
  }
  for (let i = 0; i <= jpy.length - 1; i++) {
    jpyDummy += jpy[i];
  }
  for (let i = 0; i <= chf.length - 1; i++) {
    chfDummy += chf[i];
  }
  for (let i = 0; i <= usd.length - 1; i++) {
    usdDummy += usd[i];
  }
  for (let i = 0; i <= eur.length - 1; i++) {
    eurDummy += eur[i];
  }
  for (let i = 0; i <= gbp.length - 1; i++) {
    gbpDummy += gbp[i];
  }
  for (let i = 0; i <= nzd.length - 1; i++) {
    nzdDummy += nzd[i];
  }

  const pairArr = {
    aud: Math.round((audDummy / aud.length) * 10) / 10,
    cad: Math.round((cadDummy / cad.length) * 10) / 10,
    jpy: Math.round((jpyDummy / jpy.length) * 10) / 10,
    chf: Math.round((chfDummy / chf.length) * 10) / 10,
    usd: Math.round((usdDummy / usd.length) * 10) / 10,
    gbp: Math.round((gbpDummy / gbp.length) * 10) / 10,
    eur: Math.round((eurDummy / eur.length) * 10) / 10,
    nzd: Math.round((nzdDummy / nzd.length) * 10) / 10,
  };

  const sortable = Object.fromEntries(
    Object.entries(pairArr).sort(([, a], [, b]) => b - a)
  );

  res.status(200).json({
    success: true,
    time: data[0].date,
    data: sortable,
    rawData: getLastSentimentRaw,
  });
});
