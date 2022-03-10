const Calculated = require("./signal.model");

exports.getHistory = async (req, res, next) => {
  const data = await Calculated.find();
  const newObj = Object.keys(data[0].value);
  const audArr = [];
  const cadArr = [];
  const jpyArr = [];
  const chfArr = [];
  const usdArr = [];
  const gbpArr = [];
  const eurArr = [];
  const nzdArr = [];

  const isoStr1 = "2022-07-21T09:35:31.820Z";

  data.forEach((e) => {
    const date = new Date(e.date);
    const timestampWithOffset = date.getTime();
    const offset = date.getTimezoneOffset() * 60 * 1000;
    const timestampWithoutOffset = timestampWithOffset - offset;
    const dateWithOffset = new Date(timestampWithOffset);

    const aud = {
      time: timestampWithoutOffset,
      value: e.value.aud,
    };
    const cad = {
      time: timestampWithoutOffset,
      value: e.value.cad,
    };
    const jpy = {
      time: timestampWithoutOffset,
      value: e.value.jpy,
    };
    const chf = {
      time: timestampWithoutOffset,
      value: e.value.chf,
    };
    const usd = {
      time: timestampWithoutOffset,
      value: e.value.usd,
    };
    const gbp = {
      time: timestampWithoutOffset,
      value: e.value.gbp,
    };
    const eur = {
      time: timestampWithoutOffset,
      value: e.value.eur,
    };
    const nzd = {
      time: timestampWithoutOffset,
      value: e.value.nzd,
    };
    audArr.push(aud);
    cadArr.push(cad);
    jpyArr.push(jpy);
    chfArr.push(chf);
    usdArr.push(usd);
    gbpArr.push(gbp);
    eurArr.push(eur);
    nzdArr.push(nzd);
  });

  let result = {
    audArr,
    cadArr,
    jpyArr,
    chfArr,
    usdArr,
    gbpArr,
    eurArr,
    nzdArr,
  };

  res.status(200).json({
    success: true,
    data: result,
  });
};
