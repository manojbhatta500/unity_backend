const express = require('express');
const {authenticateUser} = require('../middlewares/authenticate.user');


const {lastlocation} = require('../controllers/map.controller');






const router = express.Router();


router.post('/lastlocation',authenticateUser,lastlocation);



module.exports = router;