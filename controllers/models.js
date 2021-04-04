const catchAsync = require('../utils/catchAsync');
const getAsString = require('./getString');

exports.models = catchAsync(async(req, res, next) => {
  const make = getAsString(req.query.make);
  const models = await getModels(make);
  res.json(models);
});