const postModel = require('../models/post_model');
const userModel = require('../models/user_model');


async function SaveUserPost(req,res) {

const {
    title,
    content,
    image_url,
    category
} = req.body;

if(!title || !content || !category){
    return res.status(404).json({
        status: "error",
        message: "title,content,category are required"
    });
}


try{

    const createdPost = await postModel.create({
        title: title,
        content: content,
        image_url: image_url|| null,
        user_id: req.userid  ,
        category: category
    });


    if(!createdPost){
        return res.status(404).json({
            status: "error",
            message: "error while creating post"
        });
    }

    return res.status(200).json({
        status: "success",
        data: createdPost,
       
    });
}catch(error){
    console.error('Error fetching user data:', error);
        res.status(500).json({
            status: "error",
            message: "An error occurred while fetching user data"
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


async function fetchAllPostIds(req, res) {
    try {
      const posts = await postModel.find({}, '_id');
  
      const postIds = posts.map(post => post._id);
  
      res.status(200).json({ postIds });
    } catch (error) {
      res.status(500).json(
        {
            status: "error",
            message: "An error occurred while fetching user data"
        }
      );
    }
  }


  async function fetchIndividualPost(req,res) {


    console.log('fetch individual post id function running');

    const postId = req.params.id; 

    if(!postId){
        return  res.status(500).json(
            {
                status: "error",
                message: "post id is required for fetching post data"
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

    // console.log('Waiting for 9 seconds...');
    // // Use Promise directly without function
    // await new Promise(resolve => setTimeout(resolve, 9000));

    // console.log('9 seconds have passed');


    return res.status(200).json(
        {
            status: true,
            data: postData,
            userdata: {
                username: userData.username,
                name: userData.name || null,
                picture: userData.profile_picture_url || null
            }
        }

    );
    
  }


  async function getReletedPosts(req,res) {
    try{
        const posts = await postModel.find({});
        return res.status(200).json(
            {
                status: "success",
                data: posts
            }
        );
    }catch(e){
        return res.status(404).json({
            status: "error",
            message: "error while fetching user data."
        });
    } 
  }




module.exports = {
    SaveUserPost,
    EditUserPost,
    DeleteUserPost,
    fetchAllPostIds,
    fetchIndividualPost,
    getReletedPosts
}