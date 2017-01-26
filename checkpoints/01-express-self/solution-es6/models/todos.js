'use strict';

let tasks = {}; // a place to store tasks by person

function generateError (message, status) {
  const err = new Error(message);
  err.status = status;
  throw err;
}

module.exports = {
  reset: () => {
    tasks = {}; 
  },
  listPeople: () => {
    // returns an array of all people for whom tasks exist
    return Object.keys(tasks);
  },
  add: (name, task) => {
    // saves a task for a given person
    
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
    const validFields = new Set(['content', 'complete']);

    Object.keys(task).forEach(field => {
      if (!validFields.has(field)) generateError('adding a faulty task', 400);
    });

    tasks[name] = tasks[name] || [];
    task.complete = task.complete || false;
    tasks[name].push(task);

    return task;
  },
  list: (name, status) => {
    const userTasks = tasks[name];

    //if there is no user to send back the task list for, throw an error
    if (!userTasks) generateError('This user does not exist', 404);

    if (!status) return tasks[name];

    // If the status sent in is 'complete', then we what the query to be 'true' so it will match all complete = true tasks, and if it is 'active' it will match all complete = false tasks
    const completeQuery = status === 'complete';

    // An arrow function without a bracket (can only be used if you have one line of logic) the line of logic is implicitly `return`ed
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
    return userTasks.filter(task => task.complete === completeQuery);
  },
  complete: (name, index) => {
    tasks[name][index].complete = true;
  },
  remove: (name, index) => {
    tasks[name].splice(index,1);
  }
  // etc.
};
