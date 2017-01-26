'use strict';

var express = require('express');
var router = express.Router();
var Todos = require('../models/todos');
module.exports = router;


router.get('/', function(req, res, next) {
  var tasks = req.tasks;
  if(!req.tasks) {
    return res.status(404).end();
  }
  if(req.query.status === 'complete') {
    tasks = tasks.filter(function(task) {
      return task.complete;
    });
  } else if(req.query.status === 'active') {
    tasks = tasks.filter(function(task) {
      return !task.complete;
    });
  }
  res.json(tasks);
});

router.post('/', function(req, res, next) {
  try {
    var newTask = Todos.add(req.personName, req.body);
    res.status(201).json(newTask);
  } catch(e) {
    res.status(400).end();
  }
});

router.put('/:taskIndex', function(req, res, next) {
  Todos.complete(req.personName, Number(req.params.taskIndex));
  res.end();
});

router.delete('/:taskIndex', function(req, res, next) {
  Todos.remove(req.personName, Number(req.params.taskIndex));
  res.status(204).end();
});


