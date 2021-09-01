const { Router } = require('express');
const { validateRequestSchema } = require('../../app/middlewares/errorHandler');
const { loginValidationSchema, registerValidationSchema } = require('../../app/validations/auth');
const router = Router();
const AuthController = require('../../app/controllers/Admin/AuthController');
const controller = new AuthController();

router.post('/login', loginValidationSchema, validateRequestSchema, controller.login);
router.post('/logout', controller.logout);


module.exports = router;