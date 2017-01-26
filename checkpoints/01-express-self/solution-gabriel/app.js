'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
module.exports = app; // this line is only used to make testing easier.

// remember to plug in your router and any other middleware you may need here.
var router = require('./routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(router);

// unnecessary but shown as an example. Almost the same
// as Express's default error handler, but does not log
// stack traces even in development mode.'
app.use(function (err, req, res, next) {
  console.error('Error:', err.message);
  res.status(err.status || 500).send(err.message);
});

if (!module.parent) app.listen(3000); // conditional prevents a very esoteric EADDRINUSE issue with mocha watch + supertest + npm test.
