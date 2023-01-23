const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const path = require('path');

router.post('/login', async (req, res) => {
    // Validate user's email
    const email = req.body.email;
    const role = req.body.role;
    if (!validateEmail(email)) {
        return res.status(400).send('Invalid email');
    }

    // Generate OTP
    const otp = generateOTP();

    // Send OTP to user's email
    const mailOptions = {
        from: 'academicsonline@outlook.com',
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
    req.session.email = email;
    req.session.role = role;
    req.session.otpExpires = Date.now() + 15 * 60 * 1000; // OTP expires in 15 minutes
    return res.redirect('/otp-verification');
});


router.post('/otp-verification', async (req, res) => {
    if (req.session.otpExpires < Date.now()) {
        return res.redirect('/login?error=otp-expired');
    }
    // get the OTP from the form
    const enteredOtp = req.body.otp;
    // get the OTP from the session
    const sessionOtp = req.session.otp;
    // get the email from the session
    const email = req.session.email;
    // get the role from the session
    const role = req.session.role;

    // check if the OTPs match
    if (enteredOtp == sessionOtp) {
        delete req.session.otp;
        //Check if the email is already registered on MongoDB database
        const existingUser = await User.findOne({ email: email, role: role });
        console.log(role);
        if (existingUser) {
            res.redirect('/');
        } else {
            // res.redirect('/register');
            //Return that new registration not allowed at moment
            return res.send('New registration not allowed at the moment');
        }
    } else {
        res.redirect('/login?error=invalid-otp');
    }
});


router.post('/register', (req, res) => {
    const email = req.session.email;
    const name = req.body.name;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (password !== confirmPassword) {
        return res.redirect('/register?error=passwords-dont-match');
    }
    const user = {
        name,
        email,
        password
    };
    // Save user to database
    collection.insertOne(user, (err, result) => {
        if (err) {
            return res.status(500).send('Failed to register user');
        }
        res.redirect('/');
    });
});



//Helper Functions


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
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false,
        auth: {
            user: 'academicsonline@outlook.com',
            pass: 'acad@123'
        }
    });

    // Send email
    await transporter.sendMail(mailOptions);
}

module.exports = router;

