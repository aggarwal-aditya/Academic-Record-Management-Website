const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:acad%40123@acaddatabase.esyhw8q.mongodb.net/?retryWrites=true&w=majority";

const start = async () => {
    
    try {
        


        const connectionParams={
            useNewUrlParser: true,
            useUnifiedTopology: true 
        }
await MongoClient.connect(uri,connectionParams)
    .then( () => {
        console.log('Connected to the database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. n${err}`);
    })


       
    } catch (err) {
        throw new DbConnectionError();
        console.error(err);
    }

    
};

start();




const oneDay = 1000 * 60 * 60 * 24;

app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        url: "mongodb+srv://admin:acad%40123@acaddatabase.esyhw8q.mongodb.net/?retryWrites=true&w=majority",
        ttl: 14 * 24 * 60 * 60,
        autoRemove: 'native' 
    })
}));

const router = require('./routes/router');
const signup = require('./routes/users');
const login = require('./routes/login');
const logout = require('./routes/logout');
const instructor = require('./routes/instructor');
app.use('/', router);
app.use('/login',login);
app.use('/logout',logout)
app.use('/signup',signup);
app.use('/instructor',instructor)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))





app.listen(3000, () => {
    console.log('Server started on port 3000');
});
