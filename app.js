const express = require('express');
const app = express();
const morgan = require('morgan'); //default logging
const bodyParser = require('body-parser'); //getting  request json after parsing the url and request body
const mongoose = require('mongoose'); //Conecting to a DB

var constants = require('./constants');
var productRoutes = require('./api/routes/product');
var orderRoutes = require('./api/routes/order');
var userRoutes = require('./api/routes/user');

var MONGO_ATLAS_PASSWORD = constants.MONGO_ATLAS_PASSWORD;


mongoose.connect("mongodb://node-shop-admin:"+ MONGO_ATLAS_PASSWORD +"@cluster0-shard-00-00-xjthe.mongodb.net:27017,cluster0-shard-00-01-xjthe.mongodb.net:27017,cluster0-shard-00-02-xjthe.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true",
    { useMongoClient: true }
).then(() => {
    console.log("Connected to database!");
})
.catch((error) => {
    console.log("Connection failed!", error);
});


mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Handling CORS error
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    if(req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
        return res.status(200).json({});
    } 
    next();
})

 
app.use("/uploads", express.static("uploads"));
app.use('/products', productRoutes); 
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

//Handling unavailable resources
app.use((req, res, next) => {
    const error = new Error("Resource not found");
    error.status = 404;
    next(error);
});


//Handling all the errors
app.use((error, req, res, next) => {
    res.status(error.status||500).json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;