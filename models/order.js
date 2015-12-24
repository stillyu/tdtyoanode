var mongoose = require('mongoose');
var orderSchema = mongoose.Schema({
    orderId : Number,
    customer : {user : mongoose.Schema.ObjectId},
    clerk : {user : mongoose.Schema.ObjectId},
    detail : [
        {
            id : Number,
            name : String,
            specification : String,
            pic : String,
            unit : String,
            price : Number,
            count : Number,
            sum : Number,
            glossiness : String,
            remark : String,
        }
    ],
    tags : [String],
    time : Date,
    expectedTime : Date,
    receiver : {address : mongoose.Schema.ObjectId},
    sum : Number,
    paid : Number,
    unpaid : Number,
    remark : Number,
    step : [
        {
            name : String,
            complete : Boolean,
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
        financeId : mongoose.Schema.ObjectId,
        paid : Number,
    },
});
orderSchema.methods.getOrderDate = function(){
    var time = this.time;
    var year = time.getYear();     
    var month = time.getMonth()+1;     
    var date = time.getDate();     
    var hour = time.getHours();     
    var minute = time.getMinutes();     
    var second = time.getSeconds();
    return year + "年" + month + "月" + date + "日  " + hour + ":" + minute;
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
var Order = mongoose.model('Order', orderSchema);
module.exports = Order;