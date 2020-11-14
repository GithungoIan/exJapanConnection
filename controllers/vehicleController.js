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
    cb(new AppError('Not an image please upload only images', 404), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});


exports.uploadVehicleImages = upload.fields([
	{name: 'imageCover', maxCount: 1},
	{name: 'images', maxCount: 7}
]);

// Resize vehicle photo
exports.resizeVehicleImages = catchAsync(async(req, res, next) => {
	if(!req.files.imageCover || !req.files.images) return next();
	
	// 1) Cover Image
	req.body.imageCover = `vehicle-${Date.now()}-cover.jpeg`
	await sharp(req.files.imageCover[0].buffer)
		.resize(400, 600)
		.toFormat('jpeg')
		.jpeg({quality: 90})
		.toFile(`public/images/vehicles/${req.body.imageCover}`);
		
		// 2) Images 
		req.body.images = [];
		await Promise.all(
			req.files.images.map(async (file, i) => {
				const filename = `vehicle-${Date.now()}-${i + 1}.jpeg`;
				
				await sharp (file.buffer)
					.resize(700, 500)
					.toFormat('jpeg')
					.jpeg({quality: 90})
					.toFile(`public/images/vehicles/${filename}`);
					
				req.body.push(filename);
			})
		);
		next();
});


exports.getAllVehicles = factory.getAll(Vehicle);
exports.getVehicle = factory.getOne(Vehicle);
exports.postVehicle = factory.createOne(Vehicle);
exports.deleteVehicle = factory.deleteOne(Vehicle);
exports.updateVehicle = factory.updateOne(Vehicle);