'use strict';

const express = require('express');
const volleyball = require('volleyball');

const app = express();

app.use(volleyball);

app.use(express.static(__dirname));

const puppies = [{
  name: 'Taylor',
  image: 'https://designerdoginfo.files.wordpress.com/2013/01/puggle-puppy-4.jpg?w=584'
}, {
  name: 'Reggie',
  image: 'http://images.shape.mdpcdn.com/sites/shape.com/files/styles/slide/public/puppy-2_0.jpg'
}, {
  name: 'Christian',
  image: 'https://www.askideas.com/media/19/Papillon-Puppy-Looking.jpg'
}, {
  name: 'Jessie',
  image: 'http://www.101dogbreeds.com/wp-content/uploads/2015/10/Chi-Spaniel-Puppy-Pictures.jpg'
}, {
  name: 'Pandora',
  image: 'http://4.bp.blogspot.com/-3JeIxWBU7bY/UKjIt8lVpCI/AAAAAAAABx8/YM8piSOwczs/s1600/Schipperke-Puppy.jpg'
}];

const kittens = [{
  name: 'Toby',
  image: 'http://placekitten.com/g/401/401'
}, {
  name: 'Thaddeus',
  image: 'http://placekitten.com/g/402/402'
}, {
  name: 'Bella',
  image: 'http://placekitten.com/g/403/403'
}, {
  name: 'Tiger',
  image: 'http://placekitten.com/g/400/400'
}, {
  name: 'Oliver',
  image: 'http://placekitten.com/g/404/404'
}];

app.get('/api/puppies', function (req, res) {
  res.json(puppies.map(p=>p.name));
});

app.get('/api/kittens', function (req, res) {
  res.json(kittens.map(k=>k.name));
});

//this is for 
app.get('/api/puppies/:name', function (req, res) {
  const aPuppy = puppies.find(p => p.name === req.params.name);
  if (!aPuppy) res.sendStatus(404); //add this line if you go to a puppy that doesn't exist. And we could choose to display that differently
  else res.json(aPuppy);
});

app.get('/api/kittens/:name', function (req, res) {
  const aKitten = kittens.find(k => k.name === req.params.name);
  if (!aKitten) res.sendStatus(404); 
  else res.json(aKitten);
});


//this is for browserHistory demo
app.use(function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.listen(3000, function () {
  console.log('Server listening on port', 3000);
});
