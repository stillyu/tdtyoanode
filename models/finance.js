var mongoose = require('mongoose');
var finacneSchema = mongoose.Schema({
    user : {user : mongoose.Schema.ObjectId},
    amount : Number,
    orders : [Number],
    time : Date,
});
var Finance = mongoose.model('Finance', finacneSchema);
module.exports = Finance;