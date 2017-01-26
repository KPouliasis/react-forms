'use strict';

const express = require('express');
const router = express.Router();
const todos = require('../models/todos');
module.exports = router;

// write your routes here. Feel free to split into multiple files if you like.

router.get('/users', function (req, res, next) {
  const people = todos.listPeople();
  res.json(people); // automatically sets 200 status
});

router.get('/users/:name', function (req, res, next) {
  const name = req.params.name; // from URI :name
  const status = req.query.status; // from URI query string
  const tasks = todos.list(name, status);
  res.json(tasks);
});

router.post('/users/:name', function (req, res, next) {
  const name = req.params.name;
  const task = req.body; // parsed HTTP body, via bodyParser
  todos.add(name, task);
  res.status(201).json(task);
});

router.put('/users/:name/:index', function (req, res, next) {
  // we don't HAVE to make `name` and `index' vars, of course:
  todos.complete(req.params.name, req.params.index);
  res.end(); // I would send 204 no content, but spec wants 200
});

router.delete('/users/:name/:index', function (req, res, next) {
  todos.remove(req.params.name, req.params.index);
  res.sendStatus(204);
});
