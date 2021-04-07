const express = require('express');
const vehicleController = require('../controllers/vehicleController');
const commentRouter = require('./commentRoutes');
const router = express.Router();


router.use('/:tourId/comments', commentRouter);

router.route('/makes').get(vehicleController.getAllMakes);
router.route('/models').get(vehicleController.getAllModels);
router.route('/makesStats').get(vehicleController.getMakeStats);
router.route('/modelsStats').get(vehicleController.getModelStats);
router.route('/modelsMakeStats').post(vehicleController.getModelStatsMakes);

router.
	route('/')
	.get(vehicleController.getAllVehicles)
	.post(
		vehicleController.uploadVehicleImages,
		vehicleController.resizeVehicleImages,
		vehicleController.postVehicle);

router
	.route('/:id')
	.get(vehicleController.getVehicle)
	.patch(
		vehicleController.uploadVehicleImages,
		vehicleController.resizeVehicleImages,
		vehicleController.updateVehicle)
	.delete(vehicleController.deleteVehicle)

module.exports = router
