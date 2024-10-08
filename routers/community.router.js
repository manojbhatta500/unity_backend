const express = require('express');
const upload = require('../multerConfig');


const {
    createCommunity,
    createCommunityWithPicture

} = require('../controllers/community_controller');
const {authenticateUser} = require('../middlewares/authenticate.user');

const router = express.Router();


router.post('/create/community',authenticateUser,createCommunity);

// router for creating communities with  cover pic


router.post('/create/community/cover',authenticateUser,upload.single('image'),(req,res)=>{
    createCommunityWithPicture(req,res);
});







module.exports = router;