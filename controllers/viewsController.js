const Vehicle = require('../models/vehicleModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview =  catchAsync(async(req, res, next) => {
  // 1) Get vehicles data from collection
  const vehicles = await Vehicle.find();

  // 2) Build Template
  // 3) Render the template with data from 1
  res.status(200).render('overview', {
    title: 'vehicles',
    vehicles
  });
});

exports.getVehicle = catchAsync(async (req, res, next) => {
  // 1) get the data, for the requested tour
  const vehicle = await Vehicle.findOne({slug: req.params.slug});
  // 2) Build Template
  // 3) Render template using data from 1)
  res.status(200).render('vehicle', {
    title: 'Mazda Demio',
    vehicle
  });
});


exports.landing = catchAsync(async(req, res, next) => {
  // const vehicles = await Vehicle.find({featuredVehicle: {$ne: false}})
  // console.log(vehicles);
  res.status(200).render('landing',{
    title: 'ExJpLimited',
    // vehicles
  })
});
