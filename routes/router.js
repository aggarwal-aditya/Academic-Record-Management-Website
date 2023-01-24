const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


router.get('/login', (req, res) => {
    res.render('login', { session: req.session });
});

router.get('/otp-verification', (req, res) => {
    res.render('otp-verification');
});

router.get('/', (req, res) => {
    res.render('home', { session: req.session });
});

router.get('/addcourse', (req, res) => {
    if (!req.session.role || req.session.role != 'instructor') {
        return res.status(401).send("Unauthorised");
    }
    res.render('addcourse', { session: req.session });
});

router.get('/about-us', (req, res) => {
    res.render('aboutus', { session: req.session })
});












module.exports = router; // Export the router object

