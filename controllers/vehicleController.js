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