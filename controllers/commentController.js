const Comment = require('../models/contactModel');
const factory = require('./handlerFactroy');
// const catchAsync = require('./../utils/catchAsync');

exports.setVehicleIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.vehicle) req.body.vehicle = req.params.vehicleId;
  next();
};

exports.getAllComments = factory.getAll(Comment);
exports.getComment = factory.getOne(Comment);
exports.createComment = factory.createOne(Comment);
exports.updateComment = factory.updateOne(Comment);
exports.deleteComment = factory.deleteOne(Comment);
