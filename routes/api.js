var express = require('express');
var bodyParser = require('body-parser');
var api = express.Router();
var wget = require('wget');
var mongoConnection = require('../credentials/mongoConnection.js');
var mongoose = require('mongoose');
var User = require('../models/user.js');

/* GET home page. */
api.post('/imgDownload', function(req, res, next) {
    var src = req.body.imgSrc;
    var timestamp = (new Date()).valueOf();
    var output = './public/tmp/' + timestamp + '.jpg';
    var download = wget.download(src, output);
    res.send("http://oa.bjtdty.com:3000/tmp/" + timestamp + ".jpg");
});

api.get('/getCustomer', function(req, res, next) {
    var options = {
        server: {
           socketOptions: { keepAlive: 1 } 
        }
    };
    var db = mongoose.connect(mongoConnection.connectionString, options);
    User.find({"userType" : "customer"},function(err,user){
        var json = {
            "value" : user,
        };
        res.json(json);
    })
});

module.exports = api;
