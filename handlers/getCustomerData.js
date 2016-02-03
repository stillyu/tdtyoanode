var mongoConnection = require('../credentials/mongoConnection.js');
var mongoose = require('mongoose');
var User = require('../models/user.js');
var db = mongoose.connect(mongoConnection.connectionString, options);
var options = {
    server: {
       socketOptions: { keepAlive: 1 } 
    }
};
function getCustomer(callback){
    var htmlStr = "";
    User.find({
        'userType' : 'customer',
    },function(err,user){
        customerCount = user.length;
        if(err)
            throw err;
        else{
            user.map(function(user){
                htmlStr += "<tr data-id = '"+ user._id +"' class = 'customerTr'>";
                htmlStr +=      "<td class = 'search'>";
                htmlStr +=          user.realName;
                htmlStr +=      "</td>";
                htmlStr +=      "<td class = 'search'>";
                htmlStr +=          user.company;
                htmlStr +=      "</td>";
                htmlStr +=      "<td class = 'search'>";
                htmlStr +=          user.address;
                htmlStr +=      "</td>";
                htmlStr +=      "<td>";
                htmlStr +=          "<a href = 'javascript:void(0);' class = 'btn btn-primary viewBtn btn-sm'>查看</a>&nbsp;&nbsp;&nbsp;<a href = 'javascript:void(0);' class = 'btn btn-primary printBtn btn-sm'>打印</a>";
                htmlStr +=      "</td>";
                htmlStr += "</tr>";
            })
        }
        var customerData = {
            htmlStr : htmlStr,
            customerCount : customerCount,
        }
        callback(err,customerData);
    })
}

exports.customerData = getCustomer;