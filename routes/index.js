var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hoo Hacks 2020 - Michael Behm' });
});

module.exports = router;
