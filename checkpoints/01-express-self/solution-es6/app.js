'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
module.exports = app; // this line is only used to make testing easier.

// body-parsing middleware *first* to ensure body objects from POST requests will be translated and created as req.body
// The extended option of urlencoded allows to choose between parsing the URL-encoded data with the querystring library (when false) or the qs library (when true).
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// We use our Router exported from ./routes as the next level of middleware
// Any path starting with '/users' will be passed on to this ./routes
// When matching inside ./routes we match on the path *after* '/users'
app.use('/users', require('./routes'));

// error handling middleware comes last
// Express identifies this as error handling middleware because it has 4 parameters, the first of which is an 'err'
app.use((err, req, res, next) => {
	res.status(err.status || 500).send(err.message || 'Internal Error');
})

if (!module.parent) app.listen(3000); // conditional prevents a very esoteric EADDRINUSE issue with mocha watch + supertest + npm test.
