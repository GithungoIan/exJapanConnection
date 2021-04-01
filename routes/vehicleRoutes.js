const express = require('express');
const vehicleController = require('../controllers/vehicleController');
const commentRouter = require('./commentRoutes');
const router = express.Router();


router.use('/:tourId/comments', commentRouter);

router.route('/makes').get(vehicleController.getAllMakes);

router.
	route('/')
	.get(vehicleController.getAllVehicles)
	.post(vehicleController.postVehicle);

router
	.route('/:id')
	.get(vehicleController.getVehicle)
	.patch(
		vehicleController.uploadVehicleImages,
		vehicleController.resizeVehicleImages,
		vehicleController.updateVehicle)
	.delete(vehicleController.deleteVehicle)

module.exports = router
