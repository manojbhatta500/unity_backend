const express = require('express');

const userController = require('../controllers/user_controller');
const {authenticateUser} = require('../middlewares/authenticate.user');
const router = express.Router();

router.get('/general',authenticateUser,(req,res)=>{
    console.log('i got bros in atlanta');
    res.json({
        status: "status is shit man "
    });
});





module.exports = router;