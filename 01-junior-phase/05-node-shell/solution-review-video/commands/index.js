'use strict';

const _ = require('lodash');

// using lodash to merge obects from these three sub-modules
_.assign(module.exports,
  require('./no-stdin'),
  require('./optional-stdin'),
  require('./required-stdin')
);
