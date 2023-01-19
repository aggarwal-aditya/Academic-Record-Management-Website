const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const session = require('express-session');
const mongoose = require("mongoose");



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:acad@123@acaddatabase.esyhw8q.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});



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
