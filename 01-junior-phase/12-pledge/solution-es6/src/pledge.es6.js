'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js ES6-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

const noop = () => {};
const isFn = maybeFn => typeof maybeFn === 'function';
const funcOrNull = val => (isFn(val) ? val : null);

class $Promise {

  constructor (executor) {
    if (!isFn(executor)) throw Error('Executor must be a function');
    this._state = 'pending';
    this._handlerGroups = [];
    executor(
      val => this._internalResolve(val),
      err => this._internalReject(err)
    );
  }

  _isPending () {
    return this._state === 'pending';
  }

  _isSettled () {
    return !this._isPending();
  }

  _isFulfilled () {
    return this._state === 'fulfilled';
  }

  _isRejected () {
    return this._state === 'rejected';
  }

  _setState (state) {
    this._state = state;
  }

  _setValue (value) {
    this._value = value;
  }

  _settle (state, value) {
    if (this._isSettled()) return;
    this._setState(state);
    this._setValue(value);
    this._callHandlers();
  }

  _internalResolve (value) {
    this._settle('fulfilled', value);
  }

  _internalReject (reason) {
    this._settle('rejected', reason);
  }

  _addGroup (group) {
    this._handlerGroups.push(group);
  }

  then (successCb, errorCb) {
    var newGroup = $Promise.createGroup(successCb, errorCb);
    this._addGroup(newGroup);
    this._callHandlers();
    return newGroup.downstream;
  }

  catch (errorCb) {
    return this.then(null, errorCb);
  }

  _correctHandler (group) {
    return this._isFulfilled() ? group.successCb : group.errorCb;
  }

  _clearHandlers () {
    this._handlerGroups = [];
  }

  static createGroup (successCb, errorCb) {
    return {
      successCb: funcOrNull(successCb),
      errorCb: funcOrNull(errorCb),
      downstream: new $Promise(noop)
    };
  }

  _callHandlers () {
    if (this._isPending()) return;
    this._handlerGroups.forEach(this._callHandler, this);
    this._clearHandlers();
  }

  _callHandler (group) {
    const pA = this;
    const handler = pA._correctHandler(group);
    const pB = group.downstream;
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
      if ($Promise.isPromise(output)) {
        pB._assimilate(output);
      } else {
        pB._internalResolve(output);
      }
    }
  }

  _assimilate (promise) {
    promise.then(
      val => this._internalResolve(val),
      err => this._internalReject(err)
    );
  }

  static isPromise (maybe) {
    return maybe instanceof $Promise;
  }

  static resolve (val) {
    if ($Promise.isPromise(val)) return val;
    return new $Promise(resolve => resolve(val));
  }

  static all (arr) {
    if (!Array.isArray(arr)) throw new TypeError('`.all` requires an array');
    return new $Promise((resolve, reject) => {
      const results = [];
      const total = arr.length;
      let completed = 0;
      arr.forEach((el, i) => {
        $Promise.resolve(el)
        .then(val => {
          results[i] = val;
          if (++completed === total) resolve(results);
        })
        .catch(reject);
      });
    });
  }

}


/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = $Promise;

So in a Node-based project we could write things like this:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
