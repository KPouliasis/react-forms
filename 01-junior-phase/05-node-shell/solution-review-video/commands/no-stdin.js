'use strict';

const fs = require('fs');
const handleErr = require('../utils').handleErr;

/*----------- Functions that do not take STDIN -----------*/

function quit () {
  process.exit(0); // terminate gracefully
}

function pwd (stdin, args, done) {
  done(process.cwd());
}

function date (stdin, args, done) {
  done(Date()); // cool trick! `Date()` without `new` returns a string
}

function ls (stdin, args, done) {
  fs.readdir('.', function (err, filenames) {
    if (err) handleErr(err);
    if (args !== '-la') { // hide dotfiles
      filenames = filenames.filter(filename => (filename[0] !== '.'));
    }
    done(filenames.join('\n'));
  });
}

function echo (stdin, args, done) {
  const output = args
  .split(' ')
  .map(arg => { // convert each $ENVIRONMENT_VAR to its value
    return (arg[0] === '$') ? process.env[arg.slice(1)] : arg;
  })
  .join(' ');
  done(output);
}

// "revealing module" pattern: can see API at a glance, but have to maintain
module.exports = {
  quit: quit,
  pwd: pwd,
  date: date,
  ls: ls,
  echo: echo
};
