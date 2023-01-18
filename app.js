const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const session = require('express-session');



app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: true,
}));

const router = require('./routes/router');
app.use('/', router);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))





app.listen(3000, () => {
    console.log('Server started on port 3000');
});
