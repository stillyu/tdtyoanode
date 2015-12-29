var express = require('express');
var bodyParser = require('body-parser');
var api = express.Router();
var wget = require('wget');
var mongoConnection = require('../credentials/mongoConnection.js');
var mongoose = require('mongoose');
var User = require('../models/user.js');
var formidable = require('formidable');
var fs = require('fs');
var pdf = require('../handlers/pdf');

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

api.post('/fileUpload', function(req, res, next) {
  var form = new formidable.IncomingForm();
  form.uploadDir = './tmp';  //文件上传 临时文件存放路径 
  var timestamp = (new Date()).valueOf();
  form.parse(req,function(err,fileds,files){
    if(err) return res.redirect(303, '/error');
    fs.rename(files.file.path, __dirname + '/../public/tmp/' + files.file.name,function(error){
        if(error){
            throw error;
        }
    });
    res.send('http://oa.bjtdty.com:3000/tmp/' + files.file.name);
  })
});

api.post('/imgUpload', function(req, res, next) {
  var form = new formidable.IncomingForm();
  form.uploadDir = './tmp';  //文件上传 临时文件存放路径 
  var timestamp = (new Date()).valueOf();
  form.parse(req,function(err,fileds,files){
    if(err) return res.redirect(303, '/error');
    fs.rename(files.file.path, __dirname + '/../public/imgTmp/' + timestamp + '.jpg',function(error){
        if(error){
            throw error;
        }
    });
    res.send('http://oa.bjtdty.com:3000/imgTmp/' + + timestamp + '.jpg');
  })
});

api.post('/generatePdf', function(req, res, next) {
    var base64 = req.body.base64;
    var url = pdf.generatePdf(base64);
    res.send(url);
});


module.exports = api;
