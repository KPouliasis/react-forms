'use strict';

let tasks = {}; // a place to store tasks by person

module.exports = {

  reset: function () {
    tasks = {}; // (this function is completed for you.)
  },
  // ==== COMPLETE THE FOLLOWING (SEE `model.js` TEST SPEC) =====

  listPeople: function () {
    // get all own property names from tasks object
    return Object.keys(tasks);
  },

  add: function (name, task) {
    // see custom validation function at end of file
    validate(task);
    // not tested, but if-check preserves pre-completed tasks
    if (!task.complete) {
      task.complete = false;
    }
    if (tasks[name]) {
      tasks[name].push(task);
    } else {
      tasks[name] = [task];
    }
  },

  list: function (name, status) {
    const userTasks = tasks[name];
    // see httpError constructor at bottom of file
    if (!userTasks) {
      throw httpError(`${name} is not a valid user`, 404);
    }
    // normal listing
    if (!status) {
      return userTasks;
    }
    // listing according to 'complete' or 'active' status
    const selected = (status === 'complete');
    return userTasks.filter(function (task) {
      return task.complete === selected;
    });
  },

  complete: function (name, index) {
    tasks[name][index].complete = true;
  },

  remove: function (name, index) {
    tasks[name].splice(index, 1);
  }

};

// custom error constructor
// Express's default error handling will respect `.status`'
function httpError (message, status) {
  const err = Error(message);
  err.status = status;
  return err;
}

// field validation
function validate (task) {
  Object.keys(task).forEach(validateField);
}
// ES6 Sets make it easy to check inclusion
const validFields = new Set(['name', 'content', 'complete']);
function validateField (field) {
  if (validFields.has(field)) return;
  throw httpError(`${field} is not a valid field name`, 400);
}
