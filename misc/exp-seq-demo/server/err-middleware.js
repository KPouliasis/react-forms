'use strict';

// You will not be expected to write your own error handling middleware of this
// complexity. I am including this here because I like smaller stack traces in
// the console while demonstrating Express in a lecture / while reading
// checkpoint test results. There is no need to study this file, though of
// course you may do so if you wish.

const chalk = require('chalk');

module.exports = function (err, req, res, next) {
  if (!err.stack || !err.message) return next(err);

  const status = err.status || 500;

  if (status !== 404) {
    const cleanTrace = err.stack
    .split('\n')
    .filter(line => {
      // comment out the next two lines for full (verbose) stack traces
      const projectFile = line.indexOf(__dirname) > -1; // omit built-in Node code
      const nodeModule = line.indexOf('node_modules') > -1; // omit npm modules
      return projectFile && !nodeModule;
    })
    .join('\n');

    console.error(chalk.red('  ERR: ' + err.message));
    console.error(chalk.gray(cleanTrace));
  }

  res.status(status).render('error', { status, err });
};
