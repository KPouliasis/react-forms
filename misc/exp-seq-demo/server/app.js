'use strict';

const path = require('path');

const debug = require('debug');
const express = require('express');
const volleyball = require('volleyball');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');

const db = require('./db');
const routes = require('./routes');
const errMiddlware = require('./err-middleware');

// init and config

const debugDb = debug('db');
const debugApp = debug('app');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', nunjucks.render);
nunjucks.configure(app.get('views'), {
  noCache: true,
});

// middleware

app.use(volleyball.custom({ debug: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routing

app.use(routes);
app.use('/stylesheets', express.static(path.join(__dirname, '../node_modules/milligram/dist/')));
app.use(express.static(path.join(__dirname, '../public')));

// error throwing and handling

app.use((req, res, next) => {
  const err = new Error('Not found');
  err.status = 404;
  next(err);
});

app.use(errMiddlware);

// start

app.set('port', process.env.PORT || 3000);

db.sync()
.then(() => {
  debugDb('synced');
  const server = app.listen(app.get('port'), () => {
    debugApp(`listening: http://localhost:${server.address().port}/`);
  });
})
.catch(err => {
  console.error('Problem starting the app');
  console.error(err);
});
