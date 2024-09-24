const postModel = require('../models/post_model');
const userModel = require('../models/user_model');


const path = require('path');




async function SaveUserPost(req, res) {
    const file = req.file; 
    const { title, content, category } = req.body;

    if (!file) {
        return res.status(400).json({
            status: "error",
            message: "Image is required."
        });
    }

    if (!title || !content || !category) {
        return res.status(400).json({
            status: "error",
            message: "Title, content, and category are required."
        });
    }

    try {
        // Construct the image URL or file path
        const imageUrl = path.join('uploads', file.filename);
        
        // Save the post in the database
        const createdPost = await postModel.create({
            title,
            content,
            image_url: imageUrl,
            user_id: req.userid,
            category
        });

        if (!createdPost) {
            return res.status(500).json({
                status: "error",
                message: "Error while creating post"
            });
        }

        return res.status(200).json({
            status: "success",
            data: createdPost,
        });
        
    } catch (error) {
        console.error('Error saving post:', error);
        return res.status(500).json({
            status: "error",
            message: "An error occurred while saving the post"
        });
    }
}


async function EditUserPost(req, res) {
    try {
        const postId = req.params.id;
        const updates = req.body; 
        
        const updatedPost = await Post.findByIdAndUpdate(postId, updates, { new: true, runValidators: true });

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(200).json(updatedPost); 
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

async function DeleteUserPost(req, res) {
    try {
        const postId = req.params.id;
        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}





  

async function getReletedPosts(req, res) {
    console.log('get releted post function calling');
    try {
      const posts = await postModel.find({}).populate('user_id', 'username email profile_picture_url');
  
      const modifiedPosts = posts.map(post => {
        if (!post.user_id.profile_picture_url) {
          post.user_id.profile_picture_url = 'empty'; 
        }
        return post;
      });

    
    //  await new Promise(resolve => setTimeout(resolve, 5000));


      return res.status(200).json({
        status: "success",
        data: modifiedPosts
      });
    } catch (e) {
      return res.status(404).json({
        status: "error",
        message: "Error while fetching posts and user data."
      });
    }
  }
  


  async function fetchUserDataFromPost(req,res) {

    console.log('fetch fetchUserDataFromPost  function running');

    const postId = req.params.id; 

    if(!postId){
        return  res.status(500).json(
            {
                status: "error",
                message: "post id is required for fetching user data releted to post."
            }
          );
    }


    const postData = await postModel.findById(postId);
    if(!postData){
      return  res.status(500).json(
            {
                status: "error",
                message: "An error occurred while fetching user data"
            }
          );
        
        
    }

    const  userData = await userModel.findById(req.userid);

    if(!userData){
        return res.status(404).json({
            status: "error",
            message: "error while fetching user data."
        });
    }

    console.log(userData);


    return res.status(200).json(
        {
            status: "success",
            userdata: {
                username: userData.username,
                name: userData.name || null,
                picture: userData.profile_picture_url || null
            }
        }

    );
    
  }




module.exports = {
    SaveUserPost,
    EditUserPost,
    DeleteUserPost,
    getReletedPosts,
    fetchUserDataFromPost
}