var express = require('express');
var router = express.Router();
var formidable = require('formidable');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{layout:null});
});

router.get('/today', function(req, res, next) {
  res.render('today',{layout:null});
});

router.get('/order', function(req, res, next) {
  res.render('order',{layout:null});
});

router.post('/fileUpload', function(req, res, next) {
  var form = new formidable.IncomingForm();
  form.uploadDir = './tmp';  //文件上传 临时文件存放路径 
  form.keepExtensions = true;
  form.parse(req,function(err,fileds,files){
    if(err) return res.redirect(303, '/error');
    console.log('received fields:');
    console.log(fileds);
    console.log('received files:');
    console.log(files);
    res.send("success");
  })
});

module.exports = router;
