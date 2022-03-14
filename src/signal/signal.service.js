const Calculated = require("./signal.model");
const axios = require("axios");
exports.signal = async (fxArr) => {
  const len = await Calculated.countDocuments();
  console.log(len);
  const result = fxArr;

  let calc = [];
  const left = [];
  const right = [];
  result.forEach((e) => {
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
    aud: Math.round((audDummy / (aud.length / 2)) * 10) / 10,
    cad: Math.round((cadDummy / (cad.length / 2)) * 10) / 10,
    jpy: Math.round((jpyDummy / (jpy.length / 2)) * 10) / 10,
    chf: Math.round((chfDummy / (chf.length / 2)) * 10) / 10,
    usd: Math.round((usdDummy / (usd.length / 2)) * 10) / 10,
    gbp: Math.round((gbpDummy / (gbp.length / 2)) * 10) / 10,
    eur: Math.round((eurDummy / (eur.length / 2)) * 10) / 10,
    nzd: Math.round((nzdDummy / (nzd.length / 2)) * 10) / 10,
  };
  const pairObj = {
    value: pairArr,
    date: aud[1],
  };
  calc.push(pairObj);
  await Calculated.create(calc);
  const signalFetch = await Calculated.find().sort({ date: -1 }).limit(1);
  const signalFetchHistory = await Calculated.find()
    .sort({ date: -1 })
    .skip(1)
    .limit(1);

  let value = Object.values(signalFetch[0].value);
  let keys = Object.keys(signalFetch[0].value);
  let min = value.indexOf(Math.min(...value));
  let max = value.indexOf(Math.max(...value));

  let signal = `${keys[min]} : ${value[min]} , ${keys[max]} : ${value[max]}`;

  let prevvalue = Object.values(signalFetchHistory[0].value);
  let prevkeys = Object.keys(signalFetchHistory[0].value);
  let prevmin = prevvalue.indexOf(Math.min(...prevvalue));
  let prevmax = prevvalue.indexOf(Math.max(...prevvalue));

  let prevSignal = `${prevkeys[prevmin]} : ${prevvalue[prevmin]} , ${prevkeys[prevmax]} : ${prevvalue[prevmax]}`;

  if (!Number.isNaN(min) || !Number.isNaN(max)) {
    const signalCheckerOld = signal.split(",");
    const signalCheckerNew = prevSignal.split(",");
    if (
      signalCheckerOld[0]
        .slice(0, 3)
        .concat(signalCheckerOld[1].slice(0, 4)) ===
      signalCheckerNew[0].slice(0, 3).concat(signalCheckerNew[1].slice(0, 4))
    ) {
      console.log("signal duplicate");
      return 0;
    } else {
      for (let i = 0; i <= 7; i++) {
        await axios.get(
          `https://api.telegram.org/bot5113353180:AAFudGRBpM6zyukiEQ4LUCn2Oo-u617PY3w/sendMessage?chat_id=-1001576475552&text=${keys[i]}: ${value[i]}`
        );
      }
      axios.get(
        `https://api.telegram.org/bot5113353180:AAFudGRBpM6zyukiEQ4LUCn2Oo-u617PY3w/sendMessage?chat_id=-1001576475552&text=${signal}`
      );
    }
  } else {
    return 0;
  }
};
