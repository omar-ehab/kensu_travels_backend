const { body } = require('express-validator');

const registerValidationSchema = [
  body('first_name')
  .trim()
  .isLength({ min: 3 })
  .withMessage("first name length should be more than 3 charachters")
  .bail(),
  body('last_name')
  .trim()
  .isLength({ min: 3 })
  .withMessage("last name length should be more than 3 charachters")
  .bail(),
  body('email').trim().isEmail().withMessage("please enter valid email").bail(),
  body('password').trim().isLength({min: 6}).withMessage("password length must be at least 6").bail(),
  body('mobile').trim().isLength({min: 11, max: 11}).withMessage("please enter a valid mobile number").bail(),
  body('gender').trim().isIn(['male', 'female']).withMessage("please select gender").bail(),
];

const loginValidationSchema = [
  body('email').isEmail().withMessage("please enter valid email"),
  body('password').exists({checkFalsy: true}).withMessage("please enter password")
];

module.exports = {
  loginValidationSchema,
  registerValidationSchema,
}