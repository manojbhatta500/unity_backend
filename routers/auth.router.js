const express = require('express');

const userController = require('../controllers/user_controller');
const router = express.Router();


router.post('/signup',userController.signUp);
router.post('/login',userController.login);

router.post('/google/auth',userController.validateGoogleUser);


router.post('/forgot-password-1',userController.forgotPassword);
router.post('/forgot-password-2',userController.checkOtp);
router.post('/forgot-password-3',userController.afterVerificationChangePassword);


module.exports = router;