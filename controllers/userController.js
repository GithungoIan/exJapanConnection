const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const CatchAsync = require('../utils/CatchAsync');
const AppError = require('../utils/AppError');


// upload user image
// multer configurations
/*
const multerStrorage = multer.diskStorage({
  destination: (req, file, next) => {
    cb(null, 'public/images/users');
  },
  filename: (req, file, next) => {
    const ext  = file.mimetype.split('/')[1];
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E7);
    cb(null, `user-${uniqueSuffix}-${Date.now()}.${ext}`);
  }
});
*/
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb )=> {
  if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new AppError('Not an image please upload only images', 404), false);
  }
}
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

exports.getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
}


// get single user
exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
}

//  create new user account
exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
}

//  Update the user information
exports.updateUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not yet defined!'
	});
}

// delete user from collection
exports.deleteUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not yet defined!'
});
}
