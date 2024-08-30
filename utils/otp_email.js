const nodemailer = require('nodemailer');

require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendOtpEmail = async (email,otp) => {
    try {
        const mailOptions = {
            from: `"unity app"<no-reply@unity.com>`, 
            to: email, 
            subject: 'Your OTP Code', 
            text: `Your OTP code is ${otp}. This code is valid for 10 minutes.`, 
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);

        return otp;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Error sending OTP email');
    }
};

module.exports = sendOtpEmail;
