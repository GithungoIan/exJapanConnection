const Vehicle = require('../models/vehicleModel');
const APIFeatures = require('../utils/apiFeatures');

//Get all vehicles available in the database
exports.getAllVehicles = async (req, res) => {
	try{
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
	}catch(err) {
		res.status(404).json({
			status:'fail',
			message: err.messages
		})
	}
}

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