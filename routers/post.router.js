const express = require('express');

const {authenticateUser} = require('../middlewares/authenticate.user');

const {
    SaveUserPost,
    EditUserPost,
    DeleteUserPost,
    getReletedPosts,
    fetchUserDataFromPost
} = require('../controllers/post_controller');


const router = express.Router();


router.post('/post',authenticateUser,SaveUserPost);
router.patch('/post/:id',authenticateUser,EditUserPost);
router.delete('/post/:id',authenticateUser,DeleteUserPost);
router.get('/post',authenticateUser,getReletedPosts);
router.get('/post/:id',authenticateUser,fetchUserDataFromPost);





module.exports = router;