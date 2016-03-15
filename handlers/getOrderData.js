var mongoConnection = require('../credentials/mongoConnection.js');
var mongoose = require('mongoose');
var Order = require('../models/order.js');
var User = require('../models/user.js');
var Finance = require('../models/finance.js');
var options = {
    server: {
       socketOptions: { keepAlive: 1 } 
    }
};
var db = mongoose.connect(mongoConnection.connectionString, options);
function getOrderData(year,month,customerId,callback){
    var htmlStr = "";
    lastday = new Date(year,month,0);
    lastday = lastday.getDate();
    if(month != '0'){
        var time = {
            "$gte" : new Date(year + '-' + month + '-1'),
            "$lt" : new Date(year + '-' + month + '-' + lastday + ' 23:59:59'),
        }
    }
    else{
        var time = {
            "$gte" : new Date(year + '-1-1'),
            "$lt" : new Date(year + '-12-31 23:59:59'),
        }
    }
    if(customerId != "" && customerId != null && customerId != "undefined"){
        var option = {
            "customer.user" : customerId,
            time : time,
        };
    }
    else{
        var option = {
            time : time,
        };
    }
    Order.find(option).populate('customer.user').populate('clerk.user').populate('receiver.user').populate('step.user').exec().then(
        function(order){
            count = order.length;
            console.log(count);
            if(count == 0){
                var orderData = {
                    htmlStr : '<div class="timeline-item">无数据</div>',
                    option : option,
                    count : count,
                };
                callback(orderData);
                return 0;
            }
            order.map(function(order){
                htmlStr += '<div class="timeline-item">';
                htmlStr +=      '<div class="row">';
                htmlStr +=          '<div class="col-sm-2 date search">';
                htmlStr +=              '<i class="fa fa-file-text"></i> <small class = "orderId">' + order.orderId + '</small>';
                htmlStr +=                  '<br/>';
                htmlStr +=                  '<small>' + order.customer.user.realName + '<small>';
                htmlStr +=                  '<br/>';
                htmlStr +=                  '<small class="text-info">收货人:' + order.receiver.user.realName + '</small>';
                htmlStr +=                  '<br/>';
                htmlStr +=                  '<small class="text-navy">' + order.sum + '元</small>';
                htmlStr +=                  '<br/>';
                htmlStr +=                  order.getPaymentStatus().html;
                htmlStr +=                  '<br/>';
                htmlStr +=                  '<a href = "javascript:void(0);" class = "btn btn-xs btn-primary deleteBtn" data-id = "' + order.orderId + '">删除</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href = "view?orderId=' + order.orderId + '" class = "btn btn-xs btn-primary viewBtn" target = "_blank" data-id = "' + order.orderId + '">查看</a>';
                htmlStr +=          '</div>';
                htmlStr +=          '<div class="col-sm-10 content search">';
                for(var i = 0;i < order.detail.length;i++){
                    htmlStr +=              '<div class = "itemImg">';
                    htmlStr +=                  '<img src = "' + order.detail[i].pic + '@4e_0o_0l_110h_110w_100q.src" class = "img-thumbnail">';
                    htmlStr +=                  '<br/>';
                    htmlStr +=                  order.detail[i].name;
                    htmlStr +=              '</div>';
                }
                htmlStr +=  '</div>';
            });
        var orderData = {
            htmlStr : htmlStr,
            option : option,
            count : count,
        };
        callback(orderData);
    })
}
exports.getOrderData = getOrderData;