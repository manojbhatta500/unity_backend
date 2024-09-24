const express = require('express');

const {authenticateUser} = require('../middlewares/authenticate.user');


const upload = require('../multerConfig');

const {
    SaveUserPost,
    EditUserPost,
    DeleteUserPost,
    getReletedPosts,
    fetchUserDataFromPost
} = require('../controllers/post_controller');


const router = express.Router();




  router.post('/post', authenticateUser, upload.single('image'), (req, res) => {
    SaveUserPost(req, res);
  });
  
  
router.patch('/post/:id',authenticateUser,EditUserPost);
router.delete('/post/:id',authenticateUser,DeleteUserPost);
router.get('/post',authenticateUser,getReletedPosts);
router.get('/post/:id',authenticateUser,fetchUserDataFromPost);





module.exports = router;