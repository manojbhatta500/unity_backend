const express = require('express');
const sendOtpEmail = require('../utils/otp_email'); 
const UserModel = require('../models/user_model'); 

async function  requestOtp(req, res){
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found with this email address',
            });
        }

        const otp = await sendOtpEmail(email);

        res.status(200).json({
            status: 'success',
            message: 'OTP sent successfully to your email.',
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while sending the OTP.',
        });
    }
}


module.exports = {
    requestOtp
}