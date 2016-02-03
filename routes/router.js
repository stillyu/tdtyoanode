var express = require('express');
var router = express.Router();
var fs = require('fs');
var app = express();
var customerData = require('../handlers/getCustomerData');

/* GET home page. */
router.get('/',loginCheck, function(req, res, next) {
  	res.render('index',{layout:null});
});

router.get('/today',loginCheck, function(req, res, next) {
  res.render('today',{layout:null});
});

router.get('/order',loginCheck, function(req, res, next) {
  res.render('order',{layout:null});
});

router.get('/orderProcess',loginCheck, function(req, res, next) {
  res.render('process',{layout:null});
});

router.get('/customerManage',loginCheck, function(req, res, next) {
	customerData.customerData(function(err,customerData){
		res.render('customerManage',{
				layout : null,
				customerData : customerData.htmlStr,
				customerCount : customerData.customerCount,
			}
		);
	})
});

router.get('/orderManage',loginCheck, function(req, res, next) {
  res.render('orderManage',{layout:null});
});

router.get('/login', function(req, res, next) {
	if(req.session.userName)
		res.render('index',{layout:null});
	else
		res.render('login',{layout:null});
});

function loginCheck(req, res, next){
	if(!req.session.userName){
		res.render('login',{layout:null});
	}
	next();
}
module.exports = router;
