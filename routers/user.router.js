const express = require('express');
const UserModel = require('../models/user_model'); 

const upload = require('../multerConfig');
const {authenticateUser} = require('../middlewares/authenticate.user');
const {editBasicUserData} = require('../controllers/general_controller');
const router = express.Router();


router.patch('/update',authenticateUser,editBasicUserData);





module.exports = router;