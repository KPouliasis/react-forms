'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js ES6-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

function $Promise (executor) {
  if (typeof executor !== 'function') throw Error('missing executor');
  this._state = 'pending';
  this._handlerGroups = [];
  executor(
    this._internalResolve.bind(this),
    this._internalReject.bind(this)
  );
}

$Promise.prototype._internalResolve = function (value) {
  this._settle('fulfilled', value);
};

$Promise.prototype._internalReject = function (reason) {
  this._settle('rejected', reason);
};

$Promise.prototype._settle = function (state, value) {
  if (this._state === 'pending') {
    this._state = state;
    this._value = value;
    this._callHandlers();
  }
};

function isFn (maybe) { return typeof maybe === 'function'; }

$Promise.prototype.then = function (successCb, errorCb) {
  var group = {
    successCb: isFn(successCb) ? successCb : null,
    errorCb: isFn(errorCb) ? errorCb : null
  };
  this._handlerGroups.push(group);
  this._callHandlers();
};

$Promise.prototype.catch = function (errorCb) {
  return this.then(null, errorCb);
};

$Promise.prototype._callHandlers = function () {
  if (this._state === 'pending') return;
  this._handlerGroups.forEach(function (group) {
    var handler = (this._state === 'fulfilled') ? group.successCb : group.errorCb;
    if (handler) handler(this._value);
  }, this);
  this._handlerGroups = [];
};


/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = $Promise;

So in a Node-based project we could write things like this:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
