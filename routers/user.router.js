const express = require('express');
const UserModel = require('../models/user_model'); 

const upload = require('../multerConfig');
const {authenticateUser} = require('../middlewares/authenticate.user');
const {
    editBasicUserData,
    changeProfilePicture,
    ChangePassword
} = require('../controllers/general_controller');
 
const router = express.Router();



    router.patch('/update',authenticateUser,editBasicUserData);

    router.post('/ppchange',authenticateUser,upload.single('image'),(req, res) => {
    changeProfilePicture(req, res);
    });

    router.post('/pwchange',authenticateUser,ChangePassword);

  





module.exports = router;