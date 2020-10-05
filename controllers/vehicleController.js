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
	if(file.mimetype.startsWith('image')){
		cb(null, true);
	}else {
		cb(new AppError('Not an image please upload only images', 404), false)
	}
};

const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
});

exports.uploadVehiclePhoto = upload.single('photo');

// Resize vehicle photo
exports.resizeVehiclePhoto = catchAsync(async(req, res, next) => {
	if(!req.file){
		return next()
	}
	const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E7);
	req.file.filename = `car-${uniqueSuffix}.jpeg`;

	sharp(req.file.buffer)
		.resize(400, 500)
		.toFormat('jpeg')
		.jpeg({quality: 90})
		.toFile(`public/images/vehicles/${req.file.filename}`);

	next()
});
//Get all vehicles available in the database
exports.getAllVehicles = catchAsync(async(req, res, next) => {
	// Execute query
	const features = new APIFeatures(Vehicle.find(), req.query)
		.filter()
		.sort()
		.limitFields().
		paginate();

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
exports.getVehicle =catchAsync(async(req, res, next) => {
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
