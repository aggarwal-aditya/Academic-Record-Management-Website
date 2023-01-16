const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const session = require('express-session');

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/acadly', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
mongoose.connection.once('open', function () {
    console.log("Connected to MongoDB");
});

app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: true,
}));

const routes = require('./routes');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


app.use('/', routes);

app.get('/', (req, res) => {
    res.send('Hello, Welcome to my website!');
});



app.post('/login', async (req, res) => {
    // Validate user's email
    const email = req.body.email;
    if (!validateEmail(email)) {
        return res.status(400).send('Invalid email');
    }

    // Generate OTP
    const otp = generateOTP();

    // Send OTP to user's email
    const mailOptions = {
        from: 'agg.aditya@outlook.com',
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
    req.session.otpExpires = Date.now() + 15 * 60 * 1000; // OTP expires in 15 minutes
    res.redirect('/otp-verification');
});



app.post('/otp-verification', (req, res) => {
    if (req.session.otpExpires < Date.now()) {
        return res.redirect('/login?error=otp-expired');
    }
    // get the OTP from the form
    const enteredOtp = req.body.otp;

    const email = req.session.email;
    // get the OTP from the session
    const sessionOtp = req.session.otp;

    // check if the OTPs match
    if (enteredOtp == sessionOtp) {
        delete req.session.otp;
        //Check if the email is already registered on MongoDB database
        const existingUser = checkIfUserExists(email);
        if (existingUser) {
            res.redirect('/');
        } else {
            res.redirect('/register');
        }
    } else {
        res.redirect('/login?error=invalid-otp');
    }
});


app.post('/register', (req, res) => {
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

async function checkIfUserExists(email) {
    const existingUser = await collection.findOne({ email });
    // rest of your code here
}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

// Function for validating email address
function validateEmail(email) {
    // Regular expression for validating email
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
            user: 'agg.aditya@outlook.com',
            pass: 'Aditya@9087'
        }
    });

    // Send email
    await transporter.sendMail(mailOptions);
}


app.listen(3000, () => {
    console.log('Server started on port 3000');
});
