'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js ES6-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

function isFn (maybeFn) { return typeof maybeFn === 'function'; }
function noop () {}

// constructor and settling methods

function $Promise (executor) {
  if (typeof executor !== 'function') throw Error('Executor must be a function');
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
  if (this._state !== 'pending') return;
  this._state = state;
  this._value = value;
  this._callHandlers();
};

// public methods

$Promise.prototype.then = function (successCb, errorCb) {
  var newGroup = {
    successCb: isFn(successCb) ? successCb : null,
    errorCb: isFn(errorCb) ? errorCb : null,
    downstream: new $Promise(noop)
  };
  this._handlerGroups.push(newGroup);
  this._callHandlers();
  return newGroup.downstream;
};

$Promise.prototype.catch = function (errorCb) {
  return this.then(null, errorCb);
};

// internal instance methods

$Promise.prototype._isPending = function () {
  return this._state === 'pending';
};

$Promise.prototype._isFulfilled = function () {
  return this._state === 'fulfilled';
};

$Promise.prototype._correctHandler = function (group) {
  return this._isFulfilled() ? group.successCb : group.errorCb;
};

$Promise.prototype._clearHandlers = function () {
  this._handlerGroups = [];
};

$Promise.prototype._callHandlers = function () {
  if (this._isPending()) return;
  var pA = this;
  this._handlerGroups.forEach(function (group) {
    var handler = pA._correctHandler(group);
    var pB = group.downstream;
    if (!handler) {
      // bubbling
      if (pA._isFulfilled()) {
        pB._internalResolve(pA._value);
      } else {
        pB._internalReject(pA._value);
      }
    } else {
      // invoke the handler and check if it throws an error
      var output;
      try {
        output = handler(pA._value);
      } catch (err) {
        return pB._internalReject(err);
      }
      // deal with the return value of the handler
      if (output instanceof $Promise) {
        pB._assimilate(output);
      } else {
        pB._internalResolve(output);
      }
    }
  });
  this._clearHandlers();
};

$Promise.prototype._assimilate = function (promise) {
  promise.then(
    this._internalResolve.bind(this),
    this._internalReject.bind(this)
  );
};

// static methods (bonus, Ch. 5)

$Promise.resolve = function (val) {
  if (val instanceof $Promise) return val;
  return new $Promise(function (resolve) {
    resolve(val);
  });
};

$Promise.all = function (arr) {
  if (!Array.isArray(arr)) throw new TypeError('`.all` requires an array');
  return new $Promise(function (resolve, reject) {
    var results = [];
    var total = arr.length;
    var completed = 0;
    arr.forEach(function (el, i) {
      $Promise.resolve(el)
      .then(function (val) {
        results[i] = val;
        if (++completed === total) resolve(results);
      })
      .catch(function (err) {
        reject(err);
      });
    });
  });
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
