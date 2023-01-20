const express = require('express');
const router = express.Router();

const path = require('path');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const session = require('express-session');
const pg = require('pg');

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/otp-verification', (req, res) => {
    res.render('otp-verification');
});

router.get('/', (req, res) => {
    res.render('home');
});





















//Helper Functions










module.exports = router; // Export the router object

