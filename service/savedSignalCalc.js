const cheerio = require("cheerio");
const axios = require("axios");
const savedSentiment = require("../models/SavedSentiment");

exports.getSavedRawData = async (req, res) => {
  const total = await savedSentiment.countDocuments();
  console.log(total);
  let result = [];

  for (let i = 0; i < total; i += 28) {
    const dummy = await savedSentiment.find().skip(i).limit(28);
    result.push(dummy);
  }

  let calc = [];
  for (let x = 0; x < result.length; x++) {
    const left = [];
    const right = [];
    result[x].forEach((e) => {
      left.push({
        pair: e.pair.split("-")[0],
        value: parseInt(e.long) - 50,
        date: e.date,
      });
      right.push({
        pair: e.pair.split("-")[1],
        value: 50 - parseInt(e.long),
        date: e.date,
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
          aud.push(e.date);
          break;
        case "cad":
          cad.push(e.value);
          cad.push(e.date);
          break;
        case "jpy":
          jpy.push(e.value);
          jpy.push(e.date);
          break;
        case "chf":
          chf.push(e.value);
          chf.push(e.date);
          break;
        case "usd":
          usd.push(e.value);
          usd.push(e.date);
          break;

        case "eur":
          eur.push(e.value);
          eur.push(e.date);
          break;

        case "gbp":
          gbp.push(e.value);
          gbp.push(e.date);
          break;
        case "nzd":
          nzd.push(e.value);
          nzd.push(e.date);
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

    for (let i = 0; i <= aud.length - 1; i += 2) {
      audDummy += aud[i];
    }
    for (let i = 0; i <= cad.length - 1; i += 2) {
      cadDummy += cad[i];
    }
    for (let i = 0; i <= jpy.length - 1; i += 2) {
      jpyDummy += jpy[i];
    }
    for (let i = 0; i <= chf.length - 1; i += 2) {
      chfDummy += chf[i];
    }
    for (let i = 0; i <= usd.length - 1; i += 2) {
      usdDummy += usd[i];
    }
    for (let i = 0; i <= eur.length - 1; i += 2) {
      eurDummy += eur[i];
    }
    for (let i = 0; i <= gbp.length - 1; i += 2) {
      gbpDummy += gbp[i];
    }
    for (let i = 0; i <= nzd.length - 1; i += 2) {
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
    const pairObj = {
      value: pairArr,
      date: aud[1],
    };
    calc.push(pairObj);
  }

  res.status(200).json({
    success: true,
    data: calc,
  });
};
