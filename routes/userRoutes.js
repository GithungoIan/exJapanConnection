const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:token', authController.resetPassword);
router.post(
	'/updateMyPassword',
	 authController.protect,
	 authController.updatePassword);

router
 .patch('/updateMe',
 userController.uploadUserPhoto,
 userController.resizeUserPhoto,
 authController.protect,
 userController.updateMe)

router.delete('/deleteMe', authController.protect, userController.deleteMe);

router
	.route('/')
	.get(userController.getAllUsers)

	module.exports = router;
