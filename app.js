const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const http = require('hpp');
const path = require('path');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const vehicleRouter = require('./routes/vehicleRoutes');
const userRouter = require('./routes/userRoutes');

const app  = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware

// Set seccurity Http headers
app.use(helmet());

// Development logging
if(process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
}

// Limit request from same ip
const limiter = rateLimit({
  max: 100,
  windowMS: 60 * 60 * 1000,
  message: 'Too many request from this Ip, Please try again in an hour'
});

app.use('/api', limiter)


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
