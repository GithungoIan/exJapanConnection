const Vehicle = require('../models/vehicleModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview =  catchAsync(async(req, res, next) => {
  // 1) Get vehicles data from collection
  const vehicles = await Vehicle.find();
  const makes = await Vehicle.aggregate([
    { "$group": {_id: "$make", count: {$sum: 1}}}
  ]);
  const models = await Vehicle.aggregate([
    { "$group": {_id: "$model", count: {$sum: 1}}}
  ]);

  // 2) Build Template
  // 3) Render the template with data from 1
  res.status(200).render('overview', {
    title: 'vehicles',
    vehicles,
    makes,
    models
  });
});

exports.getVehicle = catchAsync(async (req, res, next) => {
  // 1) get the data, for the requested tour
  const vehicle = await Vehicle.findOne({slug: req.params.slug});

  if(!vehicle) {
    return next(new AppError('There is no Vehicle with that name.', 404));
  }

  res.status(200).render('vehicle', {
    title: `${vehicle.slug}`,
    vehicle
  });
});

exports.landing = catchAsync(async(req, res, next) => {
  const featuredVehicles = await Vehicle.find({featuredVehicle: {$ne : false}});
  const makes = await Vehicle.aggregate([
    { "$group": {_id: "$make", count: {$sum: 1}}}
  ]);
  const models = await Vehicle.aggregate([
    { "$group": {_id: "$model", count: {$sum: 1}}}
  ]);

  if(!featuredVehicles){
    return next(new AppError('There are no featured vehicles at the moment', 404));
  }

  res.status(200).render('landing',{
    title: 'Get new and used japan vehicles ',
    featuredVehicles,
    makes,
    models
  })
});


exports.getAbout = (req, res) => {
  res.status(200).render('about', {
    title: 'About us'
  });
};

exports.getContactUs = (req, res) => {
  res.status(200).render('contact', {
    title: 'Contact us'
  });
};


exports.getTaxInfo = (req, res) => {
  res.status(200).render('taxInfo', {
    title: 'Tax Information'
  });
};


exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};


exports.getSignUpForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign Up for your account'
  });
}

exports.getResetPasswordForm = (req, res) => {
  res.status(200).render('forgotPassword', {
    title: 'Reset Password'
  });
}

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.getBlog = (req, res) => {
  res.status(200).render('blog', {
    title: 'Blog'
  });
}


exports.updateUserData = catchAsync(async(req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
  req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );
  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});
