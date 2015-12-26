var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    userName : String,
    password : String,
    userType : String,
    realName : String,
    company : String,
    address : String,
    mobilePhone : String,
    phone : String,
    email : String,
    QQ : String,
});
var User = mongoose.model('User', userSchema);
module.exports = User;