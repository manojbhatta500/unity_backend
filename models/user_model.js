const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        // required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'is invalid']
    },
    password_hash: {
        type: String,
        required: true
    },
    date_of_birth: {
        type: Date,
        // required: true
    },
    registration_date: {
        type: Date,
        default: Date.now
    },
    profile_picture_url: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        // required: true,
        trim: true
    },
    phone_number: {
        type: String,
        trim: true,
        match: [/^\d{10,15}$/, 'is invalid'] 
    },
    bio: {
        type: String,
        trim: true,
        maxlength: 20
    },
    last_login: {
        type: Date
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    }
});

const UserModel = mongoose.model('UserModel', userSchema);

module.exports = UserModel;
