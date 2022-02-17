const cheerio = require("cheerio");
const axios = require("axios");
const SavedSentiment = require("../models/SavedSentiment");
const savedSentiment = async () => {
  console.log(new Date().toUTCString(), "savedSentiment start");
  const fxArr = [];

  const fxPairs = [
    "aud-cad",
    "aud-chf",
    "aud-jpy",
    "aud-nzd",
    "aud-usd",
    "cad-chf",
    "cad-jpy",
    "chf-jpy",
    "eur-aud",
    "eur-cad",
    "eur-chf",
    "eur-gbp",
    "eur-jpy",
    "eur-nzd",
    "eur-usd",
    "gbp-aud",
    "gbp-chf",
    "gbp-jpy",
    "gbp-nzd",
    "gbp-usd",
    "gbp-cad",
    "nzd-chf",
    "nzd-jpy",
    "nzd-usd",
    "usd-cad",
    "usd-chf",
    "usd-jpy",
  ];
  const fxPairsNzd = ["nzd-cad"];
  let elIndex = 0;
  for (let i = 0; i < fxPairs.length; i++) {
    try {
      const siteUrl = `https://www.ig.com/en/forex/markets-forex/${fxPairs[i]}`;

      const { data } = await axios({
        method: "GET",
        url: siteUrl,
      });

      const $ = cheerio.load(data);

      const percentage =
        "body > div:nth-child(3) > div > div > div > div:nth-child(3) > div > div > div > div > div.grid__col.grid__col--desktop--4.grid__col--tablet--3.grid__col--mobile--1.desktop--order--0.tablet--order--0.mobile--order--0.desktop--align--auto.tablet--align--auto.mobile--align--auto > div > div > article > div.price-ticket__sentiment > div > span";

      const direction =
        "body > div:nth-child(3) > div > div > div > div:nth-child(3) > div > div > div > div > div.grid__col.grid__col--desktop--4.grid__col--tablet--3.grid__col--mobile--1.desktop--order--0.tablet--order--0.mobile--order--0.desktop--align--auto.tablet--align--auto.mobile--align--auto > div > div > article > div.price-ticket__sentiment > div > strong";

      let percentageResult = parseInt($(percentage).text());
      const directionResult = $(direction).text();

      if (directionResult === "short") {
        percentageResult = 100 - percentageResult;
      }

      elIndex++;
      const fxObj = {
        pair: fxPairs[i],
        long: percentageResult,
        date: new Date(),
        index: elIndex,
      };

      fxArr.push(fxObj);
    } catch (err) {
      console.log(err);
    }
  }
  try {
    const siteUrl = `https://www.ig.com/en/forex/markets-forex/spot-fx-nzdcad`;
    const { data } = await axios({
      method: "GET",
      url: siteUrl,
    });

    const $ = cheerio.load(data);

    const percentage =
      "body > div:nth-child(3) > div > div > div > div:nth-child(3) > div > div > div > div > div.grid__col.grid__col--desktop--4.grid__col--tablet--3.grid__col--mobile--1.desktop--order--0.tablet--order--0.mobile--order--0.desktop--align--auto.tablet--align--auto.mobile--align--auto > div > div > article > div.price-ticket__sentiment > div > span";

    const direction =
      "body > div:nth-child(3) > div > div > div > div:nth-child(3) > div > div > div > div > div.grid__col.grid__col--desktop--4.grid__col--tablet--3.grid__col--mobile--1.desktop--order--0.tablet--order--0.mobile--order--0.desktop--align--auto.tablet--align--auto.mobile--align--auto > div > div > article > div.price-ticket__sentiment > div > strong";

    let percentageResult = parseInt($(percentage).text());
    const directionResult = $(direction).text();

    if (directionResult === "short") {
      percentageResult = 100 - percentageResult;
    }
    const fxObj = {
      pair: fxPairsNzd[0],
      long: percentageResult,
      date: new Date(),
      index: 28,
    };
    fxArr.push(fxObj);
  } catch (err) {
    console.log(err);
  }

  await SavedSentiment.create(fxArr);

  console.log(new Date().toUTCString(), "savedSentiment finish");
};

module.exports = savedSentiment;
