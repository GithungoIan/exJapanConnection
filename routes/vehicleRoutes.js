const express = require('express');
const vehicleController = require('../controllers/vehicleController');
const router = express.Router();

router.
	route('/')
	.get(vehicleController.getAllVehicles)
	.post(vehicleController.postVehicle);

router
	.route('/:id')
	.get(vehicleController.getVehicle)
	.patch(
		vehicleController.uploadVehicleImage,
		vehicleController.updateVehicle)
	.delete(vehicleController.deleteVehicle)

module.exports = router
