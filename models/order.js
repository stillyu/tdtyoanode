var mongoose = require('mongoose');
var orderSchema = mongoose.Schema({
    orderId : Number,
    customer : {
        user : {
            type : mongoose.Schema.ObjectId,
            ref : 'User',
        },
    },
    clerk : {
        user : {
            type : mongoose.Schema.ObjectId,
            ref : 'User',
        }
    },
    file : String,
    fileName : String,
    detail : [
        {
            name : String,
            specification : String,
            pic : String,
            price : Number,
            count : Number,
            sum : Number,
            glossiness : String,
        }
    ],
    tags : [String],
    time : Date,
    expectedTime : Date,
    expectedLogisticsWay : String,
    receiver : {
        user : {
            type : mongoose.Schema.ObjectId,
            ref : 'User',
        }
    },
    sum : Number,
    paid : Number,
    unpaid : Number,
    remark : String,
    step : [
        {
            name : String,
            complete : Boolean,
            user : {
                type : mongoose.Schema.ObjectId,
                ref : 'User',
            },
        }
    ],
    express : {
        logisticsWay : String,
        name : String,
        trackable : Boolean,
        time : Date,
        trackNum : String,
        trackCode : String,
        trackDetail : [String],
        trackStatus : String,
    },
    finance : {
        finance : {
            type : mongoose.Schema.ObjectId,
            ref : 'Finance',
        },
        paid : Number,
    },
    print :[
        {
            imgSrc : String,
            left : Number,
            top : Number,
            width : Number,
            height : Number,
        }
    ]
});
orderSchema.methods.getOrderTime = function(){
    var time = this.time;
    var year = time.getFullYear();
    var month = time.getMonth()+1;
    var date = time.getDate();     
    var hour = time.getHours();     
    var minute = time.getMinutes();     
    var second = time.getSeconds();
    return year + "年" + month + "月" + date + "日  " + hour + ":" + minute;
};
orderSchema.methods.getExpectedTime = function(){
    var time = this.expectedTime;
    var year = time.getFullYear();     
    var month = time.getMonth()+1;     
    var date = time.getDate();     
    return year + "年" + month + "月" + date + "日";
};
orderSchema.methods.getExpectedTimeInEdit = function(){
    var time = this.expectedTime;
    var year = time.getFullYear();     
    var month = time.getMonth()+1;     
    var date = time.getDate();     
    return year + "-" + month + "-" + date;
};
orderSchema.methods.getPaymentStatus = function(){
    if(this.unpaid == 0){
        paymentText =  '已付完';
        paymentHtml = '<small class="text-success">已付完</small>';
    }
    else{
        paymentText =  this.unpaid + '元未付';
        paymentHtml = '<small class="text-danger">' + this.unpaid + '元未付</small>';
    }
    payment = {
        text : paymentText,
        html : paymentHtml,
    }
    return payment;
};
orderSchema.methods.getShipDate = function(){
    var time = this.express.time;
    var year = time.getYear();     
    var month = time.getMonth()+1;     
    var date = time.getDate();     
    var hour = time.getHours();     
    var minute = time.getMinutes();     
    var second = time.getSeconds();
    return year + "年" + month + "月" + date + "日  " + hour + ":" + minute;
};
orderSchema.methods.getFileUrlInCStyle = function(){
    var file = this.file;
    return file.replace(/\//g,"\\");
    
};
var Order = mongoose.model('Order', orderSchema);
module.exports = Order;