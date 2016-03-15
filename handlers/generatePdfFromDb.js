var fonts = {
	Roboto: {
        normal: 'public/fonts/msyh.ttf',
        bold: 'public/fonts/msyh.ttf',
        italics: 'public/fonts/msyh.ttf',
        bolditalics: 'public/fonts/msyh.ttf',
	}
};


var PdfPrinter = require('../node_modules/pdfmake/src/printer');
var printer = new PdfPrinter(fonts);
var fs = require('fs');
var mongoConnection = require('../credentials/mongoConnection.js');
var mongoose = require('mongoose');
var User = require('../models/user.js');
var Order = require('../models/order.js');
var db = mongoose.connect(mongoConnection.connectionString, options);
var async = require('async');
var readOF = require("readof");
var options = {
    server: {
       socketOptions: { keepAlive: 1 } 
    }
};

function generatePdfFromDb(orderId){
    var docDefinition = {};
    var json = {};
    async.series([
            function getJson(callback0){
                Order.find({'orderId' : orderId},function(err,order){
                    json = order[0];
                    console.log(json);
                    callback0(null,order);
                });
            },
            function getCustomerInfoFromJson(callback1){
                User.find({'_id' : json.customer.user},function(err,user){
                    if(err)
                        throw err;
                    json.customerRealName = user[0].realName;
                    json.customerCompany = user[0].company;
                    json.customerPhone = user[0].mobilePhone || user[0].phone;
                    callback1(null,user);
                });
            },
            function getReceiverInfoFromJson(callback2){
                User.find({'_id' : json.receiver.user},function(err,user){
                    if(err)
                        throw err;
                    json.receiverRealName = user[0].realName;
                    json.receiverCompany = user[0].company;
                    json.receiverPhone = user[0].mobilePhone || user[0].phone;
                    json.receiverAddress = user[0].address;
                    callback2(null,user);
                });
            },
            function getDateInNormal(callback3){
                var time = new Date(json.expectedTime);
                var year = time.getFullYear();     
                var month = time.getMonth()+1;     
                var date = time.getDate();     
                var hour = time.getHours();     
                var minute = time.getMinutes();     
                var second = time.getSeconds();
                json.expectedTimeText = year + "年" + month + "月" + date + "日";

                var time = new Date(json.time);
                var year = time.getFullYear();     
                var month = time.getMonth()+1;     
                var date = time.getDate();     
                var hour = time.getHours();     
                var minute = time.getMinutes();     
                var second = time.getSeconds();
                json.orderIdText = year + "-" + month + "-" + date + "-" + orderId.toString().substr(6,3);
                callback3(null,time);
            },
            function jsonPrepare(callback4){
                docDefinition = {
                    pageSize: 'A4',
                    info: {
                        Title: '天德天远订货单',
                        Author: 'tdtyoa',
                        Subject: '天德天远订货单',
                        Keywords: '天德天远订货单',
                    },
                    pageMargins: [ 40, 60, 40, 60 ],
                    header : {
                        text : "订  货  单",
                        alignment : 'center',
                        fontSize : '22',
                        margin : [ 0, 20, 0, 0 ],
                    },
                    footer : {
                        columns:[
                            {
                                image: __dirname + '/../public/images/logo.png',
                                width : 80,
                                height : 40,
                                margin : [20,0,0,10],
                            },
                            {
                                text : ['地址：北京市大兴区海鑫路国信科技园\n','电话：010 - 8924 0609\n','http//:www.bjtdty.com\n'],
                                margin : [40,0,0,0],
                                fontSize : '10',
                                width : '*',
                            },
                            {
                                text : ['业务代表：喻友德\n','手机：136 0116 1139\n','QQ：7932 8799\n'],
                                alignment : "right",
                                margin : [0,0,40,0],
                                fontSize : '10',
                                width : '*',
                            },
                        ],
                    },
                    content: [
                        {
                            text : "No:" + json.orderIdText,
                            alignment : 'right',
                            margin : [ 0, -10, 0, 0 ],
                            color : '#B12923',
                        },
                        {
                            ul: [
                                "客户：" + json.customerCompany + " - " + json.customerRealName + " - " + json.customerPhone,
                                "收货人："  + json.receiverRealName + " - " + json.receiverPhone + " - " + json.receiverAddress,
                                "发货方式：" + json.expectedLogisticsWay + "        发货时间：" + json.expectedTimeText,
                            ],
                        },
                        {
                            table: {
                                headerRows : 1,
                                widths : [20,'*','*',50,30,30,35],
                                body : [],
                            },
                            margin : [ 0, 5, 0, 0 ],
                        },
                    ],
                };
                var body = [];
                body[0] = ['序号','名称','规格','光泽度','单价','数量','总价'];
                for(var i = 1;i <= json.detail.length; i++){
                    var j = i - 1;
                    body[i] = [i.toString(),json.detail[j].name,json.detail[j].specification,json.detail[j].glossiness,json.detail[j].price.toString(),json.detail[j].count.toString(),json.detail[j].sum.toString()];
                }
                var i = json.detail.length;
                var m = i+1;
                body[m] = ['备注',{text : json.remark,colSpan : 4},{},{},{},'总价',json.sum.toString()];
                docDefinition.content[2].table.body = body;
                callback4(null,'imgData');
            },
            function imgAdd(callback6){
                for(var i = 0; i < json.print.length; i++){
                    fileNameArr = json.print[i].imgSrc.split("/");
                    //清除@后缀
                    fileNameArr2 = fileNameArr[fileNameArr.length - 1].split("@");
                    fileName = fileNameArr2[0];
                    if(i != 0){
                        var imgData = {
                        image : __dirname + "/../public/imgTmp/" + fileName,
                        width : parseInt(json.print[i].width),
                        height : parseInt(json.print[i].height),
                        margin : [parseInt(json.print[i].left), parseInt(json.print[i].top - json.print[i-1].height - json.print[i-1].top), 0 , 0],
                        };
                    }

                    else{
                       var imgData = {
                        image : __dirname + "/../public/imgTmp/" + fileName,
                        width : parseInt(json.print[i].width),
                        height : parseInt(json.print[i].height),
                        margin : [parseInt(json.print[i].left), parseInt(json.print[i].top), 0 , 0],
                        }; 
                    }
                    docDefinition.content.push(imgData);
                }
                callback6(null,imgData);
            },
            function pdfMake(callback7){
                // console.log(JSON.stringify(docDefinition));
                var pdfDoc = printer.createPdfKitDocument(docDefinition);
                pdfDoc.pipe(fs.createWriteStream('public/pdf/'+orderId+'.pdf'));
                pdfDoc.end();
                callback7(null,JSON.stringify(docDefinition));
            }
        ],function (err,result){
            if(err)
                throw err;
        });
}


exports.generatePdfFromDb = generatePdfFromDb;
