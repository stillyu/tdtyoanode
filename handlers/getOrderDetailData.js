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
function getOrderDetailData(orderId,callback){
    option = {
        orderId : orderId,
    }
    Order.find(option).populate('customer.user').populate('clerk.user').populate('receiver.user').populate('step.user').exec().then(
        function(order){
            var tableHtmlStr = "";
            for(var i = 0;i < order[0].detail.length;i++){
                tableHtmlStr += "<tr>";
                tableHtmlStr +=      "<td>";
                tableHtmlStr +=          "<img src = '" + order[0].detail[i].pic + "@0o_0l_200w_100q.src' class = 'img-item img-thumbnail'>";
                tableHtmlStr +=      "</td><td class = 'productInfoTd'>";
                tableHtmlStr +=          "<span>" + order[0].detail[i].name + "</span><br/><span>" + order[0].detail[i].specification + "</span><br/><span>" + order[0].detail[i].glossiness + "</span>"
                tableHtmlStr +=      "</td><td>";
                tableHtmlStr +=          order[0].detail[i].price;
                tableHtmlStr +=      "</td><td>";
                tableHtmlStr +=          order[0].detail[i].count;
                tableHtmlStr +=      "</td><td class = 'itemSum'>";
                tableHtmlStr +=          order[0].detail[i].sum;
                tableHtmlStr +=      "</td><td>";
                tableHtmlStr +=          "<a href = '#' class = 'btn btn-info btn-sm itemEdit'><span class = 'glyphicon glyphicon-edit'>&nbsp;修改</span></a><br/><br/><a href = '#' class = 'btn btn-warning btn-sm itemRemove'><span class = 'glyphicon glyphicon-remove'>&nbsp;删除</span></a>";
                tableHtmlStr +=      "</td>";
                tableHtmlStr +=  "</tr>";
            }
            var stepHtmlStr = "";
            var stepStatus = {};
            for(var i = 0;i < order[0].step.length;i++){
                switch(order[0].step[i].name){
                    case "出片":
                        stepStatus.chupian = "label-primary";
                        break;
                    case "型材下料":
                        stepStatus.xingcaixialiao = "label-primary";
                        break;
                    case "亚克力下料":
                        stepStatus.yakelixiaoliao = "label-primary";
                        break;
                    case "铁艺加工":
                        stepStatus.tieyijiagong = "label-primary";
                        break;
                    case "烤漆":
                        stepStatus.kaoqi = "label-primary";
                        break;
                    case "丝印":
                        stepStatus.siyin = "label-primary";
                        break;
                    case "UV":
                        stepStatus.UV = "label-primary";
                        break;
                    case "腐蚀填漆":
                        stepStatus.fushitianqi = "label-primary";
                        break;
                    case "外加工":
                        stepStatus.waijiagong = "label-primary";
                        break;
                    case "包装":
                        stepStatus.baozhuang = "label-primary";
                        break;
                }
                if(order[0].step[i].complete)
                    stepHtmlStr += "<span class='label stepLabel label-primary'>" + order[0].step[i].name + "</span>&nbsp;&nbsp;&nbsp;&nbsp;"
                else
                    stepHtmlStr += "<span class='label stepLabel'>" + order[0].step[i].name + "</span>&nbsp;&nbsp;&nbsp;&nbsp;"
            }
            var tagsHtmlStr = "";
            for(var i = 0; i < order[0].tags.length; i++){
                tagsHtmlStr += '<span class="label label-primary tagLabel"><span>'+ order[0].tags[i] + '</span>&nbsp;&nbsp;&nbsp;&nbsp;&times;</span>'
            }
            var orderDetailData = {
                tableHtmlStr : tableHtmlStr,
                detailData : order[0],
                stepHtmlStr : stepHtmlStr,
                orderTimeInNormal : order[0].getOrderTime(),
                expectedTimeInNormal : order[0].getExpectedTime(),
                fileUrl : "tdtyoa:\\" + order[0].getFileUrlInCStyle(),
                expectedTimeInEdit : order[0].getExpectedTimeInEdit(),
                stepStatus : stepStatus,
                tagsHtmlStr : tagsHtmlStr,
            }
            callback(orderDetailData);
        });
}
exports.getOrderDetailData = getOrderDetailData;