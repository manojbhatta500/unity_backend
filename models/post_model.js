const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  content: {
    type: String,
    required: true
  },
  publication_date: {
    type: Date,
    default: Date.now  
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'UserModel',  
    required: true
  },
  image_url: {
    type: String
  },
  comments_count: {
    type: Number,
    default: 0
  },
  likes_count: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: ['services', 'spaces', 'materials','consumables'],
},
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
