const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/otp-verification', (req, res) => {
    res.render('otp-verification');
});

router.get('/', (req, res) => {
    res.render('home');
});

module.exports = router; // Export the router object

