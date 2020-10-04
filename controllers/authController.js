const crypto = require('crypto');
const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');


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
    return next(new AppError('Please provide email and password!', 400));
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

// Protext
exports.protect = catchAsync(async(req, res, next) => {
  // 1) Getting the token and chek if it exist
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1];
  }else if(req.cookies.jwt){
    token = req.cookies.jwt;
  }

  if(!token){
    return next(new AppError('You are not Logged in Please login to gain access', 401));
  }

  // veryfy token
  const decoded = await promisify(jwt.veryfy)(token , process.env.JWT_SECRET);

  // check od user still exists
  const currentUser = await User.findById(decoded.id);

  if(!currentUser){
    return next(new AppError('User belonging tot this token does not exist', 401));
  }

  // Check is user changed password after the token was issued
  if(currentUser.changedPasswordAfter(decoded.iat)){
    return next(
      new AppError('You recently changed your pasword! Please login again', 401)
    )
  }

  // Frant access to the protexted route
  req.user = currentUser;
  res.locals.user = currentUser;
  return next()
});

// Only for rendered paged there are no errors
exports.isLoggedIn = async(req, res, next) => {
  if(req.cookies.jwt) {
    try{
      // 1) Verification token
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

      // 2) Check if user still exists
      const currentUSer = await User.findById(decoded.id);

      if (!currentUSer) {
        return next();
      }

      // 3) Check if user changed password after the token ws issues
      if (currentUSer.changedPasswordsAfter(decoded.iat)) {
        return next();
      }
      //There is a logged in user
      res.locals.user = currentUSer;
      return next();
    }catch (err) {
      return next()
    }
  }
  next();
}

// restrict ro
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if(!roles.Includes(req.user.role)){
      return next(new AppError('You do not have permission to perform this action', 401));
    }
    next();
  }
}

// forgot passsword
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get the user based on the email address
  const user = await User.findone({email: req.body.email});
  if(!user){
    return next(new AppError('There is not user with that email address', 404));
  }
  // Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Send it to the user email
  const resetUrl = `${req.protocal}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? submit a patch request with your new password and passwordConfirm to : ${resetURL}.\n If you didn't forget your password, please ignore this email`;

  try{
    await sendEmail({
    email: user.email,
    subject: 'Your password reset token valid for (10 min)',
    message,
  });

  res.status(200).json({
    status: 'success',
    message: 'Token sent to email',
  });
  }catch (err) {
    user.passwordResetToken = undefined;
    user.PasswordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        `There was an error sending your email, please try again`,
        500
      )
    );
  }
});

// reset password
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get User based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired and there is a user, set password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordsAt property for the user

  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

// Updae user password
exports.updatePassword = catchAsync(async(req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if posted password is correct
  if (!(await user.correctPassword(req.body.passwordCurent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4) Log user in, send jwt
  createSendToken(user, 200, res);
});
