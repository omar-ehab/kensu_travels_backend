const createError = require('http-errors');
const { validationResult } = require('express-validator');
const logger = require('../../logger')

const validateRequestSchema = (req, res, next) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(createError.BadRequest(errors));
    }
  next();
}

const fourOFour = async (req, res, next) => {
  next(createError.NotFound());
}

const globalErrorHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  logger.error(err);
  res.send({
      success: false,
      message: err.message,
  });
}

module.exports = {
  fourOFour,
  globalErrorHandler,
  validateRequestSchema
}