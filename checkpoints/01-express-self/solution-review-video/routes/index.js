'use strict';

var express = require('express');
var router = express.Router();
var Todos = require('../models/todos');
var bodyParser = require('body-parser');
module.exports = router;

router.use(bodyParser.json());

router.get('/', function(req, res, next) {
  res.json(Todos.listPeople());
});


router.use('/:name', function(req, res, next) {
  req.personName = req.params.name;
  req.tasks = Todos.list(req.params.name);
  next();
});

router.use('/:name', require('./personRouter'));

// write your routes here. Feel free to split into multiple files if you like.
