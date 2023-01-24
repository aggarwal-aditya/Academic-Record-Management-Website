const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/otp-verification', (req, res) => {
    res.render('otp-verification');
});

router.get('/', (req, res) => {
    res.render('home', { session: req.session });
});

router.get('/addcourse', (req, res) => {
    res.render('addcourse');
});












module.exports = router; // Export the router object

