const UserModel = require('../models/user_model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.SECRETKEY;

const authenticateUser = (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (token) {
            token = token.split(" ")[1]; 
            let user = jwt.verify(token, secretKey);
            console.log('authenticate user function called  for middleware');
            console.log(token);
            console.log('Decoded JWT user object:', user);  
            req.userid = user.userId; // Use userId as decoded from the token
            console.log('middleware is working req.userid set', req.userid);
            next(); 
        } else {
            return res.status(400).json({
                status: "Error",
                message: "Authentication credentials are missing",
            });
        }
    } catch (error) {
        console.error('Error authenticating user:', error);
        return res.status(401).json({
            status: "error",
            message: "Access denied. Authentication credentials are invalid.",
        });
    }
};

module.exports = {
    authenticateUser
};
