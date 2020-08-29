const express = require('express');
const morgan = require('morgan');


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

module.exports = app;