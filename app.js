var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/router');
var api = require('./routes/api');
var cookieSecret = require('./credentials/cookieSecret');

var app = express();
var hbs = require('hbs');
var mongoConnection = require('./credentials/mongoConnection.js');
hbs.registerPartials(path.join(__dirname, 'views/partials'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(require('cookie-parser')(cookieSecret.cookieSecret));
app.use(require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: cookieSecret.cookieSecret,
}));

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false ,limit:"10000kb"}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// database configuration
var mongoose = require('mongoose');
var options = {
    server: {
       socketOptions: { keepAlive: 1 } 
    }
};
mongoose.connect(mongoConnection.connectionString, options);

app.use('/api/', api);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
