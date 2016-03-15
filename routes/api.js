var express = require('express');
var bodyParser = require('body-parser');
var api = express.Router();
var wget = require('wget');
var mongoConnection = require('../credentials/mongoConnection.js');
var mongoose = require('mongoose');
var User = require('../models/user.js');
var Order = require('../models/order.js');
var formidable = require('formidable');
var fs = require('fs');
var pdf = require('../handlers/pdf');
var orderSubmit = require('../handlers/orderSubmit');
var orderEdit = require('../handlers/orderEdit');
var generatePdfFromDb = require('../handlers/generatePdfFromDb');
var Client = require('ftp');
var ftpConnection = require('../credentials/ftpConnection');
var pinyin = require('pinyin');
var md5 = require('md5');
var async = require('async');

/* GET home page. */
api.post('/imgDownload', function(req, res, next) {
    var src = req.body.imgSrc;
    var timestamp = (new Date()).valueOf();
    var output = './public/tmp/' + timestamp + '.jpg';
    var download = wget.download(src, output);
    res.send("http://oa.bjtdty.com/tmp/" + timestamp + ".jpg");
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
  var fileName = req.query.fileName;
  console.log(fileName);
  var form = new formidable.IncomingForm();
  form.uploadDir = './tmp';  //文件上传 临时文件存放路径 
  form.parse(req,function(err,fileds,files){
    if(err) return res.redirect(303, '/error');
    fs.rename(files.file.path, __dirname + '/../public/imgTmp/' + fileName + '.jpg',function(error){
        if(error){
            throw error;
        }
    });
    res.send('http://oa.bjtdty.com/imgTmp/' +  fileName + '.jpg');
  })
});

api.post('/deleteOrder', function(req, res) {
    var orderId = req.body.orderId;
    Order.remove({orderId:orderId},function(err){
        if(err)
            throw err;
        else
            console.log("delete success");
    })
    res.send("delete success");
});

api.post('/userCheck',function(req,res){
    userId = req.body.userId;
    User.findById(userId,function(err,user){
        if(user == null)
            res.send("error");
        else
            res.send("success");
    })
})

api.post('/orderSubmit', function(req, res) {
    jsonStr = req.body.jsonStr;
    json = eval('(' + jsonStr + ')');
    clerk = req.session.userId;
    json.clerk = clerk;
    async.waterfall([
        function dataCheck(callback1){
            checkStatus = true;
            for(var i = 0; i < json.detail.length; i++){
                if(isNaN(json.detail[i].price) || isNaN(json.detail[i].count) || isNaN(json.detail[i].sum)){
                    checkStatus = false;
                }
            }
            callback1(null,checkStatus);
        },
        function getOrderId(checkStatus,callback2){
            if(!checkStatus)
                callback2(null,false);
            else{
                getNextOrderId(function(orderId){
                    json.orderId = orderId;
                    callback2(null,orderId);
                    return 0;
                })
            }
        },
        function orderSubmitDB(orderId,callback3){
            if(orderId == false)
                callback3(null,false);
            else{
                orderSubmit.orderSubmit(json);
                callback3(null,orderId);
            }
        },
        function greaentPdf(orderId,callback4){
            if(orderId == false)
                callback4(null,false);
            else{
                var url = pdf.generatePdf(orderId,json);
                callback4(null,"http://oa.bjtdty.com/pdf/"+orderId+".pdf");
            }
        }
        ],function(err,url){
            if(url == false){
                console.log("error");
                return res.send('price error');
            }
            else{
                return res.send(url);
            }
        });
});

api.post('/orderEdit', function(req, res) {
    jsonStr = req.body.jsonStr;
    json = eval('(' + jsonStr + ')');
    async.waterfall([
        function dataCheck(callback1){
            checkStatus = true;
            for(var i = 0; i < json.detail.length; i++){
                if(isNaN(json.detail[i].price) || isNaN(json.detail[i].count) || isNaN(json.detail[i].sum)){
                    checkStatus = false;
                }
            }
            callback1(null,checkStatus);
        },
        function orderSubmitDB(checkStatus,callback3){
            if(checkStatus == false)
                callback3(null,false);
            else{
                orderEdit.orderEdit(json);
                callback3(null,json.orderId);
            }
        },
        function greaentPdf(orderId,callback4){
            if(orderId == false)
                callback4(null,false);
            else{
                var url = generatePdfFromDb.generatePdfFromDb(orderId,json);
                callback4(null,"http://oa.bjtdty.com/pdf/"+orderId+".pdf");
            }
        }
        ],function(err,url){
            if(url == false){
                console.log("error");
                return res.send('price error');
            }
            else{
                return res.send(url);
            }
        });
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
            req.session.userId = user[0]._id;
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
    delete req.session.id;
    res.send("logout success");
});

api.post('/getOrderDataByUserId',function(req,res,next){
    var customerId = req.body.customerId;
    Order.find({'customer.user' : customerId},function(err,order){
        res.json(order);
    })
})

function orderDataCheck(json,callback){
    async.series([
        function priceCheck(callback1){
            for(var i = 0; i < json.detail.length; i++){
                if(isNaN(json.detail[i].price) || isNaN(json.detail[i].count) || isNaN(json.detail[i].sum)){
                    callback1(null,false);
                    break;
                }
                else
                    callback1(null,true);
            }
        },
        function customerCheck(callback2){
            User.find({_id : json.customer},function(err,user){
                if(user == [] || user == null || user == "")
                    callback2(err,false);
                else
                    callback2(err,true);
            })
        },
        function receiverCheck(callback3){
            User.find({_id : json.receiver},function(err,user){
                if(user == [] || user == null || user == ""){
                    console.log("11111111111");
                    callback3(err,false);
                }
                else{
                    console.log("222222222222");
                    callback3(err,true);
                }
            })
        },
        ],function(err,result){
            console.log(result);
            if(err)
                throw err;
            else
                callback(result);
        });
    return 0;
}

function getNextOrderId(cb){
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;
    var lastday = new Date(year,month,0);
    lastday = lastday.getDate();
    var time = {
        "$gte" : new Date(year + '-' + month + '-1'),
        "$lt" : new Date(year + '-' + month + '-' + lastday + ' 23:59:59'),
    }
    Order.find({time : time},
        function(err,order){
            if(err)
                throw err;
            else if(order.length > 0){
                orderId = order[order.length - 1].orderId;
                orderId = parseInt(orderId);
                orderId++;
                cb(orderId);
            }
            else{
                if(month < 10)
                    month = "0" + month;
                orderId = year+""+month+'001';
                cb(orderId);
            }
    })
}

module.exports = api;
