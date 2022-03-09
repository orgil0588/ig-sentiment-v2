const Calculated = require("./signal.model");

exports.getHistory = async (req, res, next) => {
  const data = await Calculated.find();

  res.status(200).json({
    success: true,
    data: data,
  });
};
