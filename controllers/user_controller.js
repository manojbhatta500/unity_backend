const UserModel = require('../models/user_model');

var validator = require("email-validator");
 


async function signUp(req,res){
    const {email,password,username} = req.body;
    if(!email || !password || !username){
        return res.status(400).json({
            status: "error",
            message: "email,password & username are all required."
        });
    }
    if(!validator.validate(email)){
        return res.status(400).json({
            status: "error",
            message: "invalid email."
        });
    }
    if(password.length < 8){
        console.log("the length of password is ",password.length);
        console.log("the password is  ", password);
        return res.status(400).json({
            status: "error",
            message: "password length must be 8 characters."
        });
    }
    if(username.length <5){
        return res.status(400).json({
            status: "error",
            message: "username length must be 5 characters."
        });
    }
    try{
        const alreadyExistUser = await UserModel.findOne({
            email : email
        });
        if(alreadyExistUser){
            return res.status(400).json({
                status: "error",
                message: "email already has an account."
            }); 
        }
        const alreadyTakenUserName = await UserModel.findOne({
          username : username
        });
        if(alreadyTakenUserName){
            return res.status(400).json({
                status: "error",
                message: "Username already taken."
            }); 
        }
        const userSignUpResult = await UserModel.create({
            username : username,
            email: email,
            password_hash: password
        });
        return res.status(200).json({
            status: "success",
            message: "user registered successfully."
        });
        console.log("user registered  successfully");
    }catch(e){
        return res.status(400).json({
            status: "error",
            message: "sorry, can't create an error"
        });
    }
}


async function login(params) {
    
}

async function logout(params) {
    
}

async function update(params) {
    
}

module.exports = {
    signUp
}



