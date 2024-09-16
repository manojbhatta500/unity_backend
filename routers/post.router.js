const express = require('express');

const {authenticateUser} = require('../middlewares/authenticate.user');

const {
    SaveUserPost,
    EditUserPost,
    DeleteUserPost,
    fetchAllPostIds,
    fetchIndividualPost,
    getReletedPosts
} = require('../controllers/post_controller');


const router = express.Router();


router.post('/post',authenticateUser,SaveUserPost);
router.get('/post/:id',authenticateUser,fetchIndividualPost)
router.patch('/post/:id',authenticateUser,EditUserPost);
router.delete('/post/:id',authenticateUser,DeleteUserPost);
router.get('/post',authenticateUser,getReletedPosts);
router.get('/postid',authenticateUser,fetchAllPostIds);





module.exports = router;