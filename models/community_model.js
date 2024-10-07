const mongoose = require('mongoose');
const Schema = mongoose.Schema; 


const CommunitySchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        maxlength:15
    },
    description:{
        type: String,
        maxlength:30
    },
    community_type:{
    type: String,
    enum: ['public','private'],
    },
    member_count:[{
        type: Schema.Types.ObjectId,  
        ref: 'UserModel'  ,
    }],
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true  
    },
    rules:{
        type: String,
        maxlength:50
    },
    creation_date:{
        type: Date,
        default: Date.now
    }
});





const Post = mongoose.model('Community', CommunitySchema);

module.exports = Post;