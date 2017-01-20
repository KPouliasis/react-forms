'use strict';
var express = require('express');
var router = express.Router();
// var tweetBank = require('../tweetBank');
const client = require('../db');

const baseQuery = 'SELECT tweets.id AS tweetid, * FROM tweets INNER JOIN users ON users.id = tweets.userid\n';

module.exports = function makeRouterWithSockets (io) {

  // a reusable function
  function respondWithAllTweets (req, res, next){
    client.query(baseQuery, function (err, data) {
      if (err) return next(err);
      res.render('index', {
        title: 'Twitter.js',
        tweets: data.rows,
        showForm: true
      });
    })
  }

  // here we basically treat the root view and tweets view as identical
  router.get('/', respondWithAllTweets);
  router.get('/tweets', respondWithAllTweets);

  // single-user page
  router.get('/users/:username', function(req, res, next){
    client.query(baseQuery + 'WHERE users.name=$1', [req.params.username], function (err, data) {
      if (err) return next(err);
      res.render('index', {
        title: 'Twitter.js',
        tweets: data.rows,
        showForm: true,
        username: req.params.username
      });
    });
  });

  // single-tweet page
  router.get('/tweets/:id', function(req, res, next){
    client.query(baseQuery +  'WHERE tweets.id = $1', [req.params.id], function (err, data) {
      if (err) return next(err);
      res.render('index', {
        title: 'Twitter.js',
        tweets: data.rows,
        showForm: true
      });
    });
  });

  // create a new tweet
  router.post('/tweets', function(req, res, next){

    // search user by name
    client.query('SELECT * FROM users WHERE users.name = $1', [req.body.name], checkUserId);

    // see if we found that user
    function checkUserId (err, data) {
      if (err) return next(err);
      if (!data.rows.length) makeNewUser();
      else insertTweet(null, data);
    }

    // if we didn't find a user, make a new one
    function makeNewUser () {
      const newPicture = 'http://lorempixel.com/48/48?name=' + req.body.name;
      client.query('INSERT INTO users (name, pictureurl) VALUES ($1, $2) RETURNING *', [req.body.name, newPicture], insertTweet);
    }

    // once we have the user id, create a tweet using it
    function insertTweet (err, data) {
      if (err) return next(err);
      const userId = data.rows[0].id;
      client.query('INSERT INTO tweets (userid, content) VALUES ($1, $2) RETURNING *', [userId, req.body.content], sendFinalResponse);
    }

    // if we made a tweet, tell the client to load the home page
    function sendFinalResponse (err) {
      if (err) return next(err);
      // io.sockets.emit('new_tweet', data.rows[0]); // not including socket stuff for twitter-sql solution
      res.redirect('/');
    }
  });

  // // replaced this hard-coded route with general static routing in app.js
  // router.get('/stylesheets/style.css', function(req, res, next){
  //   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
  // });

  return router;
}
