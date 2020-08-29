const express = require('express');
const morgan = require('morgan');
const app  = express();


// Middleware
if(process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
}


module.exports = app;