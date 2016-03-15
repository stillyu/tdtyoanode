var express = require('express');
var router = express.Router();
var fs = require('fs');
var app = express();
var customerData = require('../handlers/getCustomerData');
var orderData = require('../handlers/getOrderData');
var orderDetailData = require('../handlers/getOrderDetailData');

/* GET home page. */
router.get('/',loginCheck, function(req, res, next) {
    var day = new Date();
    var year = day.getFullYear();
    var month = day.getMonth() + 1;
    res.render('index',{
        layout:null,
        year : year,
        month : month,
        realName : req.session.realName,
    });
});

router.get('/today',loginCheck, function(req, res, next) {
  res.render('today',{layout:null});
});

router.get('/edit',loginCheck, function(req, res, next){
    var orderId = req.query.orderId;
	orderDetailData.getOrderDetailData(orderId,function(orderDetailData){
        res.render('edit',{
            layout : null,
            fileUrl : orderDetailData.fileUrl,
            fileName : orderDetailData.detailData.fileName,
            customerName : orderDetailData.detailData.customer.user.realName,
            customerId : orderDetailData.detailData.customer.user._id,
            receiverName : orderDetailData.detailData.receiver.user.realName,
            receiverId : orderDetailData.detailData.receiver.user._id,
            expectedLogisticsWay : orderDetailData.detailData.expectedLogisticsWay,
            expectedTime : orderDetailData.expectedTimeInEdit,
            remark : orderDetailData.detailData.remark,
            tbody : orderDetailData.tableHtmlStr,
            chupian : orderDetailData.stepStatus.chupian,
            xingcaixialiao : orderDetailData.stepStatus.xingcaixialiao,
            yakelixiaoliao : orderDetailData.stepStatus.yakelixiaoliao,
            tieyijiagong : orderDetailData.stepStatus.tieyijiagong,
            kaoqi : orderDetailData.stepStatus.kaoqi,
            siyin : orderDetailData.stepStatus.siyin,
            UV : orderDetailData.stepStatus.UV,
            fushitianqi : orderDetailData.stepStatus.fushitianqi,
            waijiagong : orderDetailData.stepStatus.waijiagong,
            baozhuang : orderDetailData.stepStatus.baozhuang,
            tags : orderDetailData.tagsHtmlStr,
        });
    })
})

router.get('/order',loginCheck, function(req, res, next) {
  res.render('order',{layout:null});
});

router.get('/orderProcess',loginCheck, function(req, res, next) {
  res.render('process',{layout:null});
});

router.get('/accountManage',loginCheck, function(req, res, next) {
  res.render('accountManage',{layout:null});
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
    var year = req.query.year;
    var month = req.query.month;
    var customer = req.query.customer;
    orderData.getOrderData(year,month,customer,function(orderData){
        res.render('orderManage',{
            layout : null,
            orderData : orderData.htmlStr,
        });
    })
});

router.get('/view', loginCheck, function(req, res, next) {
    var orderId = req.query.orderId;
    orderDetailData.getOrderDetailData(orderId,function(orderDetailData){
        phone = orderDetailData.detailData.receiver.user.mobilePhone || orderDetailData.detailData.receiver.user.phone;
        res.render('viewOrder',{
            layout : null,
            step : orderDetailData.stepHtmlStr,
            orderDetail : orderDetailData.tableHtmlStr,
            orderId : orderDetailData.detailData.orderId,
            company : orderDetailData.detailData.customer.user.company,
            customerRealName : orderDetailData.detailData.customer.user.realName,
            orderTime : orderDetailData.orderTimeInNormal,
            orderRemark : orderDetailData.detailData.remark,
            expectedTime : orderDetailData.expectedTimeInNormal,
            logisticsWay : orderDetailData.expectedLogisticsWay,
            receiverInfo : orderDetailData.detailData.receiver.user.realName + ' - ' + phone + ' - ' + orderDetailData.detailData.receiver.user.address,
            fileUrl : orderDetailData.fileUrl,
        });
    })
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
