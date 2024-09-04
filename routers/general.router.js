const express = require('express');


const {authenticateUser} = require('../middlewares/authenticate.user');
const {getBasicUserData} = require('../controllers/general_controller');



const router = express.Router();

router.get('/general',authenticateUser,getBasicUserData);





module.exports = router;