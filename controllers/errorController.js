const AppError = require('../utils/appError');

const handleCastErrorDb = (error) => {
  const message = `Invalid ${err.apth}: ${err.value}`;
  return new AppError(message, 400);
}

const handleDuplicateFieldsDB = (error) => {
  // Select the error within quotes
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);
  const message = `Duplicate field value: ${value} please use another value`;
  return new AppError(message, 400);
}

const handleValidationErrorDb = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(',  ')}`;
  return new AppError(message, 400);
}

const sendErrorDev = (err, req, res) => {
  // API
  if(req.originalUrl.startsWith('/api')){
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }

  // Rendered Website
  console.error('ERROR 🔥 ', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went Wrong',
    msg: err.message
  });

}

const sendErrorProd = (err, req, res) => {
  // API
  if(req.originalUrl.startsWith('/api')){
    // if Operational, trusted Error Send to client
    if(err.isOperationsl){
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }

    // Programming or other unknown error
    // 1_ Log error
    console.error('ERROR 🔥 ', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }

  // Rendered website
  // Send trusted error to clinet
  if(error.isOperational){
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: 'PLease try again later.'
    });
  }
};


module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if(process.env.Node_Env === 'development'){
    sendErrorDev(err, req, res);
  }else if(process.env.Node_Env === 'production'){
    let error = {..err};
    error.message = err.message;
    // handle cast error
    if(error.name === 'CastError') error = handleCastErrorDb(error);
    // Handle Duplicate error
    if(error.name === 11000) error = handleDuplicateFieldsDB(error);
    // Validation errors
    if(error.name === 'ValidationError') error = handleValidationErrorDb(error);

  }
}
