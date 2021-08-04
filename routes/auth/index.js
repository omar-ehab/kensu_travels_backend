const { Router } = require('express');
const { validateRequestSchema } = require('../../app/middlewares/errorHandler');
const { loginValidationSchema, registerValidationSchema } = require('../../app/validations/auth');
const router = Router();
const AuthController = require('../../app/controllers/AuthController');
const controller = new AuthController();

router.post('/login', loginValidationSchema, validateRequestSchema, controller.login);
router.post('/register', registerValidationSchema, validateRequestSchema, controller.register);
router.post('/refresh-token', controller.refreshToken);
router.post('/logout', controller.logout);


module.exports = router;