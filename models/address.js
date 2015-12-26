var mongoose = require('mongoose');
var addressSchema = mongoose.Schema({
    name : String,
    company : String,
    address : String,
    mobilePhone : String,
    phone : String,
});
var Address = mongoose.model('Address', addressSchema);
module.exports = Address;