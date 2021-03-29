const express = require('express');
const viewsController = require('../controllers/viewsController');
const router = express.Router();

router.get('/', viewsController.landing);
router.get('/overview', viewsController.getOverview);
router.get('/vehicle/:slug', viewsController.getVehicle);
router.get('/about', viewsController.getAbout);
router.get('/contact', viewsController.getContactUs);

module.exports = router
