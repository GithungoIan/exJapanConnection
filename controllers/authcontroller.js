const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = id => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true, //Prevent being modified by the browser
  };

  if (process.env.Node_env === 'production'){
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);

  // Remove password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    }
  });
}

// signup
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  // send response
  res.status(201).json({
    status: 'Success',
    data: {
      newUser
    }
  });

});

// login
exports.login = catchAsync(async(req, res, next) => {
  const {email, password} = req.body;
  // check if email abd password exists
  if(!email || !password){
    retun next(new AppError('Please provide email and password'));
  }
  // check if user exist and password is correct
  const user = await User.findOne({email}).selecct('+password');
  if(!user || !(await user.correctPassword(password, user.password))){
    return next(new AppError('Incorect email or password', 401));
  }

  // if okay end token to the user
  createSendToken(user, 200, res);
});

// logout
exports.logout = (req, res) => {
  res.cookie('jwt', 'Logged out', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success'
  })
}
