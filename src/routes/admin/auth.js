const { Router } = require('express');
const { validateRequestSchema } = require('../../app/middlewares/errorHandler');
const { loginValidationSchema, registerValidationSchema } = require('../../app/validations/auth');
const { verifyAuthority } = require('../../app/middlewares/AdminAuth');
const router = Router();
const AuthController = require('../../app/controllers/Admin/AuthController');
const controller = new AuthController();

router.post('/login', loginValidationSchema, validateRequestSchema, controller.login);
router.post('/logout', controller.logout);
router.get('/test_auth', verifyAuthority, (req, res) => {
    res.json(req.user);
});


module.exports = router;