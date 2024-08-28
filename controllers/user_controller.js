const UserModel = require('../models/user_model');

var validator = require("email-validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();


const secretKey = process.env.SECRETKEY;

 


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

        // generating hashed password
        const hashedPassword = await  bcrypt.hash(password,10);



        const userSignUpResult = await UserModel.create({
            username : username,
            email: email,
            password_hash: hashedPassword
        });


        console.log('user created successfully');
        return res.status(200).json({
            status: "success",
            message:  username + " registered successfully."
        });
    }catch(e){
        return res.status(400).json({
            status: "error",
            message: "we can't create an account at this moment."
        });
    }
}


async function login(req,res) {

    const {
        email,
        password
    } = req.body;

    if(!email || !password ){
        return res.status(400).json({
            status: "error",
            message: "email,password  are  required.",

        });
    }

    if(!validator.validate(email)){
        return res.status(400).json({
            status: "error",
            message: "invalid email."
        });
    }

    const alreadyExistUser = await UserModel.findOne({
        email : email
    });

    if(!alreadyExistUser){
        return res.status(400).json({
            status: "error",
            message: "User not Registered."
        }); 
    }


    const matchedPassword = await bcrypt.compare(password, alreadyExistUser.password_hash);


    if(!matchedPassword){
        return res.status(400).json(
            {
            status: "error",
            message: "Sorry, Wrong Password"
        }
    ); 
    }


    console.log('password matched so it means user can kind of login');


const token = jwt.sign({ userId: alreadyExistUser._id }, secretKey); // You can set an expiration time

return res.status(200).json({
    status: "success",
    message: "Login successful",
    token: token,  
});    
    
}

async function logout(params) {
    
}

async function update(params) {
    
}

module.exports = {
    signUp,
    login
}





