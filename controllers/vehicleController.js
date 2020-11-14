const multer  = require('multer');
const sharp = require('sharp');
const Vehicle = require('../models/vehicleModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');



//multer configyrations
/*
const multerStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/images/vehicles');
	},
	filename: (req, file, cb) => {
		const ext = file.mimetype.split('/')[1];
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E7);
		cb(null, `car-${uniqueSuffix}.${ext}`);
	}
});
*/

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
	req.body.imageCover = 'vehicle-${req.params.id}-${Date.now()}-cover.jpeg';
	await sharp(req.files.imageCover[0].buffer)
		.resize(400, 600)
		.toFormat('jpeg')
		.jpeg({quality: 90})
		.toFile(`public/images/vehicle/${filename}`);
		
		// 2) Images 
		req.body.images = [];
		await Promise.all(
			req.files.images.map(async (file, i) => {
				const filename = `vehicle-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
				
				await sharp (file.buffer)
					.resize(700, 5000)
					.toFormat('jpeg')
					.jpeg({quality: 90})
					.toFile(`public/images/vehicles/${filename}`);
			})
		);
		next();
});


//Get all vehicles available in the database
exports.getAllVehicles = catchAsync(async(req, res, next) => {
	// Execute query
	const features = new APIFeatures(Vehicle.find(), req.query)
		.filter()
		.sort()
		.limitFields()
		.paginate();

	const vehicles = await features.query;

	//Send response back
	res.status(200).json({
		status:'success',
		result: vehicles.length,
		data: {
			vehicles
		}
	});
})

// Get single vehicle based on its identifier
exports.getVehicle = catchAsync(async(req, res, next) => {
	const vehicle = await Vehicle.findById(req.params.id);

	if(!vehicle){
		return next(new AppError('No vehicle found with that ID', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			vehicle
		}
	});
});

// Post a new vehicle to the database
exports.postVehicle = catchAsync(async(req, res, next) => {
	const newVehicle = await Vehicle.create(req.body);

	res.status(201).json({
		status:'success',
		data:{
			vehicle: newVehicle
		}
	});
});

// Update vehicle information
exports.updateVehicle = catchAsync(async(req, res, next) => {
	const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body,{
		new: true,
		runValidators: true
	});

	if(!vehicle){
		return next(new AppError('No vehicle dound with that ID'));
	}
	res.status(200).json({
		status: 'success',
		data: {
			vehicle
		}
	});
});

// delete vehicle form the collection
exports.deleteVehicle = catchAsync(async(req, res,next) => {
	const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

	if(!vehicle){
		return next(new AppError('No vehicle found with that ID', 404));
	}

	res.status(204).json({
		status:'success',
		data: null
	});
});
