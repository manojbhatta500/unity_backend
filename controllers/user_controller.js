const UserModel = require('../models/user_model');
const OtpModel = require('../models/otp_model');

var validator = require("email-validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendOtpEmail = require('../utils/otp_email'); 

const otpGenerator = require('otp-generator'); 


require('dotenv').config();


const secretKey = process.env.SECRETKEY;


const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('635613543687-q1s9ugc68oubmgcbo79sa3jpd4r55hfq.apps.googleusercontent.com'); 

async function validateGoogleUser(req, res) {
  const { idToken } = req.body;  
  if (!idToken) {
    return res.status(400).json({
      status: "error",
      message: "idToken is required",
    });
  }
  try {
    const ticket = await client.verifyIdToken({
      idToken: idToken,  
      audience: '635613543687-q1s9ugc68oubmgcbo79sa3jpd4r55hfq.apps.googleusercontent.com',  
    });
    const payload = ticket.getPayload();  
    console.log(payload);
    const doesUserExists = await UserModel.findOne({
        email : payload.email
    });
    if(doesUserExists){
        console.log("user already exists");
        const token = jwt.sign({ userId: doesUserExists._id },secretKey);
        console.log('JWT Token:', token);
        return res.status(200).json({
            status: "success",
            message: `Successfully logged in as ${payload.name}.`,
            token: token,
          });    
    }else{
        // user does not exists and will sign in and then login 
        // created user and now login
        const userSignUpResult = await UserModel.create({
            username : payload.name,
            email: payload.email,
            name:payload.given_name,
            googleId:payload.sub,
            profile_picture_url: payload.picture
        });
        console.log('user created successfully');
        console.log('now we will loggin user.');
        const token = jwt.sign({ userId: userSignUpResult._id },secretKey);
        console.log('JWT Token:', token);
        return res.status(200).json({
            status: "success",
            message: `Successfully signed up and logged in as ${payload.name}.`,
            token: token,
          });
    }
  } catch (error) {
    console.error('Error verifying Google ID token:', error);
    return res.status(401).json({
      status: "error",
      message: "Invalid Google ID token",
    });
  }
}



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


async function login(req, res) {
    const { email, password } = req.body;

    console.log('Incoming request body:', req.body);

    if (!email || !password) {
        console.log('Missing email or password');
        return res.status(400).json({
            status: "error",
            message: "email and password are required.",
        });
    }

    if (!validator.validate(email)) {
        console.log('Invalid email format');
        return res.status(400).json({
            status: "error",
            message: "Invalid email.",
        });
    }

    console.log("before try");
    try {

        const alreadyExistUser = await UserModel.findOne({ email });

        console.log('Query result:', alreadyExistUser);


        if (!alreadyExistUser) {
            console.log('User not found:', email);
            return res.status(400).json({
                status: "error",
                message: "User not Registered.",
            });
        }

        console.log('User found:', alreadyExistUser);

        const matchedPassword = await bcrypt.compare(password, alreadyExistUser.password_hash);

        if (!matchedPassword) {
            console.log('Password mismatch for user:', email);
            return res.status(400).json({
                status: "error",
                message: "Sorry, Wrong Password.",
            });
        }

        console.log('Password matched for user:', email);

        const token = jwt.sign({ userId: alreadyExistUser._id },secretKey);
        console.log('JWT Token:', token);

        return res.status(200).json({
            status: "success",
            message: "Login successful",
            token,
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error.",
        });
    }
}



async function forgotPassword(req,res) {

    const {email} = req.body;

    if(!email){
        res.json({
            status: "error",
            message: "please provide the email."
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
    
    const otp = otpGenerator.generate(4, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets:false,
        specialChars: false
    });
    const otpResult = await sendOtpEmail(email,otp);

    console.log('the otp is ',otp);


    const filter = { email: email }; 

    const update = { otp: otp }; 

    const options = { 
            upsert: true, 
            new: true 
        };

    const otpStorageResult = await OtpModel.findOneAndUpdate(filter, update, options);



    

    res.status(200).json({
        status: 'success',
        message: 'OTP sent successfully to your email.',
    });    
}





async function checkOtp(req,res) {

    const { otp,email} = req.body;

    if(!otp || !email){
        return res.json({
            status: "error",
            message: "both otp and email are required."
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

    
    const findOtpDetails = await OtpModel.findOne({ email: email });

if (!findOtpDetails) {
    console.log("No OTP found for the given email.");
    return res.status(404).json({ status: "Error", message: "OTP not found" });
}

const savedOtp = findOtpDetails.otp;

console.log("saved otp is ", savedOtp);
console.log("user otp is ", otp);


    if( savedOtp == otp){
        return res.status(200).json({
            status: "success",
            message: "verified Otp."
        }); 
    }else{
        return res.status(400).json({
            status: "error",
            message: "Try again otp did not matched."
        }); 
    }
}

async function afterVerificationChangePassword(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: "error",
            message: "Both email and password are required."
        });
    }

    if (!validator.validate(email)) {
        return res.status(400).json({
            status: "error",
            message: "Invalid email format."
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            status: "error",
            message: "Password length must be at least 8 characters."
        });
    }

    try {
        const alreadyExistUser = await UserModel.findOne({ email: email });
        
        if (!alreadyExistUser) {
            return res.status(400).json({
                status: "error",
                message: "User not registered."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const filter = { email: email }; 
        const update = { password_hash: hashedPassword }; 
        const options = { new: true }; // Remove upsert if you don't want to create new users

        const updatedUser = await UserModel.findOneAndUpdate(filter, update, options);

        if (updatedUser) {
            return res.status(200).json({
                status: "success",
                message: "Password changed successfully."
            });
        } else {
            return res.status(500).json({
                status: "error",
                message: "Something went wrong while updating the password."
            });
        }
    } catch (error) {
        console.error('Error changing password:', error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error."
        });
    }
}




module.exports = {
    signUp,
    login,
    checkOtp,
    forgotPassword,
    afterVerificationChangePassword,
    validateGoogleUser
}





