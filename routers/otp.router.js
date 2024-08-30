const express = require('express');
const {requestOtp} = require('../controllers/otp_controller');
const router = express.Router();



router.post('/request-otp', requestOtp);


module.exports = router;






