const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const vehicleRouter = require('./routes/vehicleRoutes');
const userRouter = require('./routes/userRoutes');
const viewsRouter = require('./routes/viewRoutes');

const app  = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

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

//Body parser json
app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({extended: true, limit: '10kb'}));
app.use(cookieParser());

//Data Sanitization againist NOSQL query Injection
app.use(mongoSanitize());
// Data Sanitization againist Xss
app.use(xss());

// Prevent parameter ploution
app.use(
  hpp({
    whitelist: ['price'],
  })
);



// routes
app.use('/', viewsRouter);
app.use('/api/v1/vehicles', vehicleRouter);
app.use('/api/v1/users', userRouter);


// test Middleware
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalErl} on this Server`, 400));
});

// error handling
app.use(globalErrorHandler);
module.exports = app;
