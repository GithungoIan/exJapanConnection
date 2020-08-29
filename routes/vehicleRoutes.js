const express = require('express');
const vehicleController = require('../controllers/vehicleController');
const router = express.Router();

// Vehicle routes without id
router
	.route('/')
	.get(vehicleController.getAllVehicles)
	.post(vehicleController.postVehicle);

	
//  vehicle routes with id
router
	.route('/:id')
	.get(vehicleController.getVehicle)
	.patch(vehicleController.updateVehicle)
	.delete(vehicleController.updateVehicle);
	
module.exports = router;