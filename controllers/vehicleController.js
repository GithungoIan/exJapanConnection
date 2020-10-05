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
exports.getVehicle = async (req, res) => {
	try {
		const singleVehicle = await Vehicle.findById(req.params.id);

		res.status(200).json({
			status: 'success',
			data: {
				singleVehicle
			}
		})

	} catch (err) {
		res.status(404).json({
			status:'fail',
			message: err.messages
		})

	}
}

// Post a new vehicle to the database
exports.postVehicle = async (req, res) => {
	try {
		const newVehicle = await Vehicle.create(req.body);

		res.status(201).json({
			status:'success',
			data:{
				vehicle: newVehicle
			}
		});
	} catch (err) {
		res.status(404).json({
			status:'fail',
			message: err.messages
		});
	}
}

// Update vehicle information
exports.updateVehicle = async (req, res) => {
	try {
		const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body);

		res.status(200).json({
			status: 'success',
			data: {
				vehicle
			}
		});

	} catch (err) {
		res.status(404).json({
			status:'fail',
			message: err.messages
		});
	}
}

// delete vehicle form the collection
exports.deleteVehicle = async (req, res) => {
	try {
		await Vehicle.findByIdAndDelete(req.params.id);

		res.status(204).json({
			status:'success',
			data: null
		});
	} catch (err) {
		res.status(404).json({
			status:'fail',
			message: err.messages
		});
	}
}
