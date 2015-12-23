var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{layout:null});
});

router.get('/today', function(req, res, next) {
  res.render('today',{layout:null});
});

module.exports = router;
