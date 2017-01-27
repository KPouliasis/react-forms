'use strict';

const api = require('./api');
const router = require('express').Router(); // eslint-disable-line new-cap

router.get('/', function (req, res, next) {
  res.render('index');
});

router.use('/api', api);

module.exports = router;
