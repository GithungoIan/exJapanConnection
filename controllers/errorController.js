const AppError = require('../utils/appError');

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
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if(process.env.Node_Env === 'development'){
    sendErrorDev(err, req, res);
  }
}
