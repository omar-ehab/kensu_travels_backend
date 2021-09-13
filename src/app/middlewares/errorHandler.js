const createError = require('http-errors');
const { validationResult } = require('express-validator');
const logger = require('../../logger')

const validateRequestSchema = (req, res, next) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(createError.BadRequest(errors));
      return;
    }
  next();
}

const fourOFour = async (req, res, next) => {
  next(createError.NotFound());
}

const globalErrorHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  
  if(err.status !== 404)
    logger.error(err);

  res.send({
      success: false,
      message: process.env.NODE_ENV === 'production' ? errorMessage(err) : err.message,
  });
}

const errorMessage = (err) => {
  if(err.status === 500) {
    return "Server Error";
  } else if(err.status === 404) {
    return "Not Found";
  }
}

module.exports = {
  fourOFour,
  globalErrorHandler,
  validateRequestSchema
}