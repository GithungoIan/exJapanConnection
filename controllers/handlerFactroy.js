const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');


exports.deleteOne = (Model) => {
  catchAsync(async(req, res, next) => {
    const doc = await Moedl.findByIdAndDelete(req.params.id);
    
    if(!doc){
      return  next(new AppError('Do document found with that ID', 404));
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  });
}