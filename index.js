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

//mongoose.connect('mongodb://localhost/FashionStore');
//mongoose.Promise = global.Promise;

mongoose.connect("mongodb://127.0.0.1:27017/FashionStore", { useUnifiedTopology: true   , useFindAndModify: false});

app.use(express.json());  //  useNewUrlParser: true, useFindAndModify: false
app.use(express.urlencoded({extended:true}));

app.use('/api',routes);

app.use(function(err,req,res,next){  // handle errors

    console.log(err);

res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
res.header("Access-Control-Allow-Methods" , "POST, GET, OPTIONS");
 
  next();

 
    res.send(err);

});


app.listen(process.env.port || 4000,function(){  // process.env.port useful when host this app

    console.log('now listening for requests');

});

