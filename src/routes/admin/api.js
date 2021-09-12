const { Router } = require('express');
const { verifyAuthority } = require('../../app/middlewares/AdminAuth');
const router = Router();
const ProfileController = require('../../app/controllers/Admin/ProfileController');
const profileController = new ProfileController();

router.get('/profile', verifyAuthority, profileController.index);


module.exports = router;