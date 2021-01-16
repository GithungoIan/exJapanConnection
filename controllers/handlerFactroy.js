const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');


exports.deleteOne = (Model) =>
  catchAsync(async(req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });


exports.updateOne = (Model) =>
  catchAsync(async(req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if(!doc){
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });

  });


exports.createOne = (Model) =>
  catchAsync(async(req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });


exports.getOne = (Model) =>
  catchAsync(async(req, res, next) => {
    let query = Model.findById(req.params.id);
    const doc = await query

    if(!doc){
      return next(new AppError('No document found with that Id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });


exports.getAll = (Model) =>
  catchAsync(async(req, res, next) => {
    //To allow for nested Get reviews on vehicles(simple hack)
    let filter = {};
    if(req.params.vehicleId) {
      filter = {vehicle: req.params.vehicleId};
    }

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // const doc = await features.query.explain();
    const doc = await features.query;

    // Send Response
    res.status(200).json({
      status: 'success',
      result: doc.length,
      data: {
        doc
      }
    });
  });
