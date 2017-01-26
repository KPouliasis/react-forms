'use strict';

const express = require('express');
const router = express.Router();
// requiring in a file means that you are literally getting whatever the module.exports is equal to (no other functions or variables will be returned)
//Destructuring. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
const {reset, listPeople, add, list, complete, remove} = require('../models/todos.js')
module.exports = router;

// write your routes here. Feel free to split into multiple files if you like.
router.get('/', (req, res, next) => {
	res.json(listPeople());
})

router.get('/:name/tasks', (req, res, next) => {
	const name = req.params.name,
		status = req.query.status;

	res.json(list(name, status));
})

router.post('/:name/tasks', (req, res, next) => {
	const name = req.params.name,
		task = req.body;
	res.status(201).json(add(name, task));
})

router.put('/:name/tasks/:index', (req, res, next) => {
	complete(req.params.name, req.params.index);
	res.end();
})

router.delete('/:name/tasks/:index', (req, res, next) => {
	remove(req.params.name, req.params.index);
	res.sendStatus(204);
})