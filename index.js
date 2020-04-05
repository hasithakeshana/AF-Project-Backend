const express = require('express');
const routes = require('./routes/api');

const mongoose = require('mongoose');

var cors = require('cors');
//const bodyParser = require('body-parser');


const app = express(); // set up an express app

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

//connect to mongodb

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://rashmika:1234@fashionstore-k14re.mongodb.net/test?retryWrites=true&w=majority"

MongoClient.connect(uri, function(err, client) {
    if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
    }
    console.log('Connected...');
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});


app.use(express.json());  //  useNewUrlParser: true, useFindAndModify: false
app.use(express.urlencoded({extended: true}));

app.use('/api', routes);

app.use(function (err, req, res, next) {  // handle errors

    console.log(err);
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    next();
    res.send(err);

});


app.listen(process.env.port || 4000, function () {  // process.env.port useful when host this app

    console.log('now listening for requests');

});

