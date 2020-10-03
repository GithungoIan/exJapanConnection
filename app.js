const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const vehicleRouter = require('./routes/vehicleRoutes');
const userRouter = require('./routes/userRoutes');

const app  = express();
// Middleware
if(process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
}


// routes
app.use('/api/v1/vehicles', vehicleRouter);
app.use('/api/v1/users', userRouter);

// test Middleware
app.all('*', (req, res, next) => {
  next(new Apperror(`Can't find ${req.originalErl} on this Server`, 400));
});

// error handling
app.use(globalErrorHandler);
module.exports = app;
