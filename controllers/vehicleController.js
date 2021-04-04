const multer  = require('multer');
const sharp = require('sharp');
const Vehicle = require('../models/vehicleModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactroy');
const AppError = require('../utils/appError');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadVehicleImages = upload.fields([
  {name: 'imageCover', maxCount: 1},
  {name: 'images', maxCount: 8}
]);

exports.resizeVehicleImages = catchAsync(async (req, res, next) => {
  if(!req.files.imageCover || !req.files.images) return next();

  // cover image
  const uniqueSuffix =  Math.round(Math.random() * 1E5);
  req.body.imageCover = `vehicle-${uniqueSuffix}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(350, 200)
    .toFormat('jpeg')
    .jpeg({quality: 90})
    .toFile(`public/images/vehicles/${req.body.imageCover}`);


  // Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const uniqueSuffix =  Math.round(Math.random() * 1E5);
      const filename = `vehicle-${uniqueSuffix}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(800, 600)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(`public/images/vehicles/${filename}`);

      req.body.images.push(filename);
    })
  );
  next();
});

exports.getAllMakes = catchAsync(async (req, res, next) => {
  const makes = await Vehicle.find({}, {make: 1});
  
  if(!makes) {
    return next(new AppError('No makes found', 404));
  }
  
  res.status(200).json({
    status: 'success',
    results: makes.length,
    data: {
      data: makes
    }
  });
})


exports.getAllModels = catchAsync(async (req, res, next) =>{
  const models = await Vehicle.find({}, {model: 1});
  
  if(!models){
    return next(new AppError('No models found', 404));
  }
  
  res.status(200).json({
    status: 'success',
    results: models.length,
    data: {
      data: models
    }
  });
});

const getMakes = async() =>{
   const makes = await Vehicle.aggregate([
    { "$group": {_id: "$make", count: {$sum: 1}}}
  ]);
  console.log(makes);
  return makes;
}

const getModels = async(model) => {
  const makes = await Vehicle.aggregate([
    { "$group": {_id: "$make", count: {$sum: 1}}}
  ]);
  console.log(makes);
  return makes;
}

exports.getMakeStats = catchAsync(async (req, res, next) => {
  const makes = await Vehicle.aggregate([
    { "$group": {_id: "$make", count: {$sum: 1}}}
  ]);
  
  // const makes = getMakes;
  
  res.status(200).json({
    status: 'success',
    data: {
      makes
    }
  });
})

exports.getModelStats = catchAsync(async (req, res, next) => {
  const models = await Vehicle.aggregate([
    { "$group": {_id: "$model", count: {$sum: 1}}}
  ]);
  
  res.status(200).json({
    status: 'success',
    data: {
      models
    }
  });
})

exports.getAllVehicles = factory.getAll(Vehicle);
exports.getVehicle = factory.getOne(Vehicle);
exports.postVehicle = factory.createOne(Vehicle);
exports.deleteVehicle = factory.deleteOne(Vehicle);
exports.updateVehicle = factory.updateOne(Vehicle);
