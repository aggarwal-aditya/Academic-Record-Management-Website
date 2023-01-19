const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const session = require('express-session');
const { MongoClient, ServerApiVersion } = require('mongodb');


const start = async () => {
    
    try {
        const uri = "mongodb+srv://admin:acad%40123@acaddatabase.esyhw8q.mongodb.net/?retryWrites=true&w=majority";


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






app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: true,
}));

const router = require('./routes/router');
const signup = require('./routes/users');
app.use('/', router);
app.use('/signup',signup);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))





app.listen(3000, () => {
    console.log('Server started on port 3000');
});
