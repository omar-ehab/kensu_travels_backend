const { Router } = require('express');
const { validateRequestSchema } = require('../../app/middlewares/errorHandler');
const { loginValidationSchema } = require('../../app/validations/auth');
const { verifyAuthority } = require('../../app/middlewares/AdminAuth');
const router = Router();
const AuthController = require('../../app/controllers/Admin/AuthController');
const controller = new AuthController();

router.post('/login', loginValidationSchema, validateRequestSchema, controller.login);
router.post('/logout', verifyAuthority, controller.logout);
router.get('/my-account', verifyAuthority, controller.me);


module.exports = router;