/* ----------------------------------------------------------------------------
 * When does .all keep things in order?
 *
 * Answer: always gives RESULTS in order.
 * The individual promises in the input array may *complete* in any order.
 * But .all maps each result to the corresponding index in the output array.
 */

// a function which returns a promise that fulfills after a random delay.
function randomlyDelayedPromise (value) {
  const time = Math.random() * 1000;
  return new Promise (resolve => {
    setTimeout(() => resolve(value), time);
  });
}

// two promises, 'yo' might fulfill before 'hi' or vice-versa.
const promises = [randomlyDelayedPromise('hi'), randomlyDelayedPromise('yo')];

Promise.all(promises)
.then(values => {
  console.log(values.join(' ')); // will ALWAYS be 'hi yo', never 'yo hi'.
})
.catch(err => console.error(err));

/* ----------------------------------------------------------------------------
 * How can we keep promise syntax clean?
 *
 * Answer: Gabriel's preferred (subjective) promise chain format:
 * each .then or .catch goes on its own new line.
 */

promiseReturningFunc(2347)
.then(function (result1) {
  // whatever you do in here
  foo(result.baz);
  bar(result.qux);
  return promiseReturningFunc(1234)
})
.then(function (result2) {
  // more stuffs
  qux(result2.foo);
})
.catch(function (err) {
  console.error(err);
});

// ES6: promise chains and arrow funcs go really well together!

promiseReturningFunc(2347)
.then(result1 => {
  // whatever you do in here
  foo(result.baz);
  bar(result.qux);
  return promiseReturningFunc(1234)
})
.then(result2 => {
  // more stuffs
  qux(result2.foo);
})
.catch(err => {
  console.error(err);
});

/* ----------------------------------------------------------------------------
 * .all to replace a long chain — faster?
 *
 * Answer: the exercises in this workshop *artificially* suggested that you
 * make the promise chains sequential, not parallel. In the real world,
 * if you had to do N *independent* async tasks and then a final task when
 * all N were finished, it would make sense to do them in parallel, wait
 * for them all to finish with .all, and then do the final task.
 * That would only be as slow as the slowest promise.
 *
 * However, when each promise depends on the previous result, you have no
 * choice: you MUST use chaining to make the actions sequential.
 */



/* ----------------------------------------------------------------------------
 * Why would we ever nest promises?
 *
 * Answer: usually you don't have to; it's an antipattern in most cases.
 * However if you need to use an early async result AND a later async result,
 * nesting may be ok — SO LONG AS YOU REMEMBER TO RETURN THE CHAIN.
 *
 * Following are some solutions for collecting values as we go down
 * a promise chain:
 */

// Solution one: outer scope variable. Polluting outer scopes is icky.

let user;
fetchUserById(1) // hypothetical promise-returning function.
.then(function (fetchedUser) {
  user = fetchedUser; // store in outer scope.
  return fetchUserById(user.bestFriendId);
})
.then(function (bestFriend) {
  // now we can use the current result AND the stored earlier result.
  console.log(user.name + ' your best friend is ' + bestFriend.name);
})
.catch(function (err) {
  console.error(err);
});

// Solution two: nesting promises. Dangerous if you forget to `return` the chain.
// Also, icky. Dense, hard to refactor. Back to callback hell.

fetchUserById(1) // async get a user
.then(function (user) {
  return fetchUserById(user.bestFriendId) // don't forget to return!
  .then(function (bestFriend) {
    // both user and bestFriend are in scope because of nesting.
    console.log(user.name + ' your best friend is ' + bestFriend.name);
  })
})
.catch(function (err) {
  console.error(err);
});


// Solution three: Bluebird binding. Can bind handlers to an object and
// store results on `this`, makes it available further down the chain.
// Pretty good overall, but only in certain libraries (nonstandard).

fetchUserById(1)
.bind({}) // bind the chain to an object
.then(function (user) {
  this.user = user; // store the result in my bound object
  return fetchUserById(user.bestFriendId)
})
.then(function (bestFriend) {
  // can get the earlier result stored on the bound object
  console.log(this.user.name + ' your best friend is ' + bestFriend.name);
})
.catch(function (err) {
  console.error(err);
});

// Solution four: upcoming JS syntax for async/await uses promises and
// generator functions to do almost magically-nice stuff.

async function greetUser (id) {
  try {
    const user = await fetchUserById(id); // yields control, comes back later
    const bestFriend = await fetchUserById(user.bestFriendId); // yields control, comes back later
    console.log(user.name + ' your best friend is ' + bestFriend.name);
  } catch (err) {
    console.error(err);
  }
}

// ^^^ so beautiful! *sniff* ^^^
