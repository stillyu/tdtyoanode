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
var Client = require('ftp');
var ftpConnection = require('../credentials/ftpConnection');
var pinyin = require('pinyin');
var md5 = require('md5');

/* GET home page. */
api.post('/imgDownload', function(req, res, next) {
    var src = req.body.imgSrc;
    var timestamp = (new Date()).valueOf();
    var output = './public/tmp/' + timestamp + '.jpg';
    var download = wget.download(src, output);
    res.send("http://oa.bjtdty.com:3000/tmp/" + timestamp + ".jpg");
});

api.get('/getReceiver', function(req, res, next) {
    var options = {
        server: {
           socketOptions: { keepAlive: 1 } 
        }
    };
    var db = mongoose.connect(mongoConnection.connectionString, options);
    User.find({"userType" : {$in:["customer","receiver"]}},function(err,user){
        var json = {
            "value" : user,
        };
        res.json(json);
    })
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
    var myDate = new Date();
    var ymd = myDate.getFullYear() + '/' + myDate.getMonth() + 1 + '/' + myDate.getDate() + '/';
    var ftp = new Client();
    ftp.connect(ftpConnection);
    ftp.on('ready', function(){
        ftp.mkdir('ftp/' + ymd,function(err){
            if (err) console.log(err);
        })
        ftp.put(files.file.path, 'ftp/' + ymd + files.file.name, function(err) {
            if (err) console.log(err);
            ftp.end();
        });
    });
    // fs.rename(files.file.path, __dirname + '/../public/tmp/' + files.file.name,function(error){
    //     if(error){
    //         throw error;
    //     }
    // });
    res.send('mycdr://192.168./ftp/' + ymd + files.file.name);
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
    jsonStr = req.body.jsonStr;
    json = eval('(' + jsonStr + ')');
    var url = pdf.generatePdf(json);
    res.send(url);
});

api.post('/addNewUser', function(req, res, next) {
    realName = req.body.realName;
    company = req.body.company;
    phone = req.body.phone;
    mobilePhone = req.body.mobilePhone;
    address = req.body.address;
    userType = req.body.userType;
    User.find({realName:realName},function(err,user){
        if(user.length > 0){
            res.send("fail");
            return 0;
        }
        if(userType == "receiver"){
            userName = "receiver";
            password = "";
        }
        else{
            userName = pinyin(realName,{
                style: pinyin.STYLE_NORMAL,
            });
            var userNamePinyin = "";
            for(var key in userName){
                userNamePinyin += userName[key];
            }
            password = md5(userNamePinyin);
        }
        addUser = new User({
            userName : userNamePinyin,
            password : password,
            userType : userType,
            realName : realName,
            company : company,
            address : address,
            phone : phone,
            mobilePhone : mobilePhone,
        }).save();
        res.send("success");
    })
});

api.post('/loginCheck', function(req, res, next) {
    userName = req.body.userName;
    password = req.body.password;
    password = md5(password);
    User.find({
        userName : userName,
        password : password,
    },function(err,user){
        if(user.length > 0){
            req.session.userName = user[0].userName;
            req.session.userType = user[0].userType;
            req.session.realName = user[0].realName;
            req.session.company = user[0].company;
            req.session.address = user[0].address;
            req.session.mobilePhone = user[0].mobilePhone;
            req.session.phone = user[0].phone;
            req.session.email = user[0].email;
            req.session.QQ = user[0].QQ;
            res.send("success");
        }
        else{
            res.send("fail");
            console.log(req.session.userType);
        }
    })
});

api.post('/logout', function(req, res, next) {
    delete req.session.userName;
    delete req.session.userType;
    delete req.session.realName;
    delete req.session.company;
    delete req.session.address;
    delete req.session.mobilePhone;
    delete req.session.phone;
    delete req.session.email;
    delete req.session.QQ;
    res.send("logout success");
});

module.exports = api;
