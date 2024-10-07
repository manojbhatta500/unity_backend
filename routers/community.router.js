const express = require('express');

const {createCommunity} = require('../controllers/community_controller');
const {authenticateUser} = require('../middlewares/authenticate.user');

const router = express.Router();


router.post('/create/community',authenticateUser,createCommunity);






module.exports = router;