var mongoConnection = require('../credentials/mongoConnection.js');
var mongoose = require('mongoose');
var Order = require('../models/order.js');
var User = require('../models/user.js');
var Finance = require('../models/finance.js');
var async = require('async');
var options = {
    server: {
       socketOptions: { keepAlive: 1 } 
    }
};
var db = mongoose.connect(mongoConnection.connectionString, options);
function orderEdit(json){
    // console.log(json);
    var orderId = "";
	var orderData = {};
	async.series([
		function jsonPrepare(callback2){
            orderData.orderId = json.orderId;
			orderData.customer = {};
            orderData.receiver = {};
            orderData.customer.user = json.customer;
            orderData.receiver.user = json.receiver;
            orderData.time = json.time;
            orderData.expectedTime = json.expectedTime;
            orderData.sum = json.sum;
            orderData.paid = json.paid;
            orderData.unpaid = json.unpaid;
            orderData.remark = json.remark;
            orderData.expectedLogisticsWay = json.expectedLogisticsWay;
            orderData.tags = json.tags;
            orderData.step = json.step;
            orderData.detail = json.detail;
            orderData.remark = json.remark;
            orderData.file = json.file;
            if(!json.useOldPicDesign){
                orderData.print = json.print;
                console.log(orderData);
            }
            callback2(null,orderData);
		},
		],function(err,result){
            if(err)
                throw err;
            else{
                Order.update({orderId : json.orderId},{$set : orderData},function(err){
                    if(err)
                        throw err;
                })
            }
        })
}
exports.orderEdit = orderEdit;