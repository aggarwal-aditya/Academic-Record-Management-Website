const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const session = require('express-session');
router.post('/', async (req, res) => {
    // Validate user's email
    const email = req.body.email;
    if (!validateEmail(email)) {
        return res.status(400).send('Invalid email');
    }

    // Generate OTP
    const otp = generateOTP();

    // Send OTP to user's email
    const mailOptions = {
        from: 'a@skhan-IDEAPAD-GAMING-3-15IMH05',
        to: email,
        subject: 'OTP for login',
        text: `Your OTP for login is ${otp}`
    };
    try {
        await Promise.race([
            sendEmail(mailOptions),
            new Promise((resolve, reject) => {
                setTimeout(() => reject(new Error('Timeout')), 100000) // 10 seconds
            })
        ]);
    } catch (err) {
        console.log(err);
        if (err.message === 'Timeout') {
            return res.status(408).send('Failed to send OTP, Timeout exceeded');
        }
        return res.status(500).send('Failed to send OTP');
    }


    // Store OTP and email in user's session
    req.session.otp = otp;
    
    req.session.otpExpires = Date.now() + 15 * 60 * 1000; // OTP expires in 15 minutes
    return res.status(200).send('OTP sent successfully');
});


router.post('/otp-verification',async (req, res) => {
    if (req.session.otpExpires < Date.now()) {
        return res.status(410).send('OTP Expired');
    }
    // get the OTP from the form
    const enteredOtp = req.body.otp;

    const email = req.body.email;
    // get the OTP from the session
    const sessionOtp = req.session.otp;

    // check if the OTPs match
    if (enteredOtp == sessionOtp) {
        delete req.session.otp;
        let user = await User.findOne({ email: req.body.email });
        if (!user)
        {
            return res.status(401).send('UNAUTHORISED: The email is not registered');
        }

        req.session.email = email;
        req.session.role=user.role;
        req.session.name=user.name;
        return res.status(200).send('OK '+user.role+' Logged In');
        //Check if the email is already registered on MongoDB database
        // const existingUser = checkIfUserExists(email);
        // if (existingUser) {
        //     res.redirect('/');
        // } else {
        //     res.redirect('/register');
        // }
    } else {
        return res.status(401).send('UNAUTHORISED: Invalid OTP');
    }
});




async function checkIfUserExists(email) {
    const existingUser = await User.findOne({ email });
    // rest of your code here
}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

// Function for validating email address
function validateEmail(email) {
    // Regular expression for validating email
    const re = /^(([^<>$()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Function for sending email using nodemailer
async function sendEmail(mailOptions) {
    // Configure nodemailer
    const transporter = nodemailer.createTransport({
        service: 'postfix',
  host: 'localhost',
  secure: false,
  port: 25,
  auth: { user: 'skhan', pass: '1603' },
  tls: { rejectUnauthorized: false }
    });

    // Send email
    await transporter.sendMail(mailOptions);
}
module.exports = router;
 
