
const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const LastLocationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'UserModel',  
        required: true
      },
    latitide:{
        type:String,
        required: true
    },
    longitude:{
        type: String,
        required:true
    }
});

const AccCreatedLocationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'UserModel',  
        required: true
      },
    latitide:{
        type:String,
        required: true
    },
    longitude:{
        type: String,
        required:true
    }
});



const  LastLocation = mongoose.model('LastLocation',LastLocationSchema);

const AccCreatedLocation = mongoose.model('AccCreatedLocation',AccCreatedLocationSchema);






module.exports = {
    LastLocation,AccCreatedLocation
}