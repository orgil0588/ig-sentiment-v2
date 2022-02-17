const Sentiment = require("../models/Sentiment");
const Signal = require("../models/Signal");
const axios = require("axios");
const signal = async (minutes) => {
  console.log(`${new Date().toUTCString()} : Signal`);
  const data = await Sentiment.find().sort({ date: -1 }).limit(28);

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

  let value = Object.values(pairArr);
  let keys = Object.keys(pairArr);
  let min = value.indexOf(Math.min(...value));
  let max = value.indexOf(Math.max(...value));
  let signal = `${keys[min].toUpperCase()} : ${value[min]} , ${keys[
    max
  ].toUpperCase()} : ${value[max]}`;

  let signalArr = {
    signal: signal,
    date: new Date(),
  };
  const signalFetch = await Signal.find().sort({ date: -1 }).limit(1);
  const signalCheckerOld = signalFetch[0].signal.split(",");

  const signalCheckerNew = signalArr.signal.split(",");
  if (
    signalCheckerOld[0].slice(0, 3).concat(signalCheckerOld[1].slice(0, 4)) ===
    signalCheckerNew[0].slice(0, 3).concat(signalCheckerNew[1].slice(0, 4))
  ) {
    console.log("signal duplicated");
    await Sentiment.deleteMany();
    return;
  } else {
    console.log("signal alert!!!");
    await Signal.create(signalArr);
    await Sentiment.deleteMany();
    for (let i = 0; i <= 7; i++) {
      await axios.get(
        `https://api.telegram.org/bot5113353180:AAFudGRBpM6zyukiEQ4LUCn2Oo-u617PY3w/sendMessage?chat_id=-1001576475552&text=${keys[i]}: ${value[i]}`
      );
    }
    axios.get(
      `https://api.telegram.org/bot5113353180:AAFudGRBpM6zyukiEQ4LUCn2Oo-u617PY3w/sendMessage?chat_id=-1001576475552&text=${signal}`
    );
  }
};
module.exports = signal;
