var Client = require('ftp');
var ftpConnection = require('./credentials/ftpConnection');


var ftp = new Client();
ftp.connect(ftpConnection);

ftp.on('greeting',function(msg){
	console.log(msg);
})


var myDate = new Date();
var ymd = myDate.getFullYear() + '/' + myDate.getMonth() + 1 + '/' + myDate.getDate() + '/';
ftp.on('ready', function(){
    ftp.put('./public/images/logo.png', 'ftp/logo.png', function(err) {
        if (err) throw err;
        ftp.end();
    });
});