'use strict';

var tasks = {}; // a place to store tasks by person


module.exports = {
  reset: function () {
    tasks = {}; // (this function is completed for you.)
  },
  // ==== COMPLETE THE FOLLOWING (SEE `model.js` TEST SPEC) =====
  listPeople: function () {
    // returns an array of all people for whom tasks exist
    return Object.keys(tasks);
  },

  add: function (name, task) {

    function isValidTask(task) {
      var validKeys = ['content'];
      for(var key in task) {
        if(!validKeys.includes(key)) {
          return false;
        }
      }
      return true;
    }

    if(!isValidTask(task)) {
      throw new Error('task is invalid');
    }

    task.complete = false;
    if(Array.isArray(tasks[name])) {
      tasks[name].push(task);
    } else {
      tasks[name] = [task];
    }
    return task;
  },

  list: function(name) {
    return tasks[name];
  },

  complete: function(name, taskIndex) {
    tasks[name][taskIndex].complete = true;
  },

  remove: function(name, index) {
    tasks[name].splice(index, 1);
  }


  // etc.
};
