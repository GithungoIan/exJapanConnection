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

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if(!req.file){
    return next()
  }

  const uniqueSuffix = Date.now() + '-'+ Math.round(Math.random() * 1E6)
  req.file.filename = `user-${uniqueSuffix}.jpeg`

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({quality: 90})
    .toFile(`public/images/users/${req.file.filename}`);

  next();

});


// fillrer out unwanted user info
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

// Get all users
exports.getAllUsers = CatchAsync(async(req, res) => {

  const users = await User.find();
  res.status(200).json({
    status: 'Success',
    results: users.length,
    data: {
      users,
    },
  });
})

// Update Current user
exports.updateMe = CatchAsync(async(req, res, next) => {
  // 1) Create an error if user tries to update password
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'This route is not for password update please use /updateMyPassword'
      )
    );
  }

  // 2) Filter out unwanted data
  const filteredBody = filterObj(req.body, 'name', 'email');
  if(req.file) filteredBody.photo = req.file.filename;

  // 3) Update THE USER Document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      updatedUser,
    },
  });
});

// Delete current user
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
  next();
});



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
