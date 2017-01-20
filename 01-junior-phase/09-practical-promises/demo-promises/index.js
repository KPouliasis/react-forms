const db = require('./db');

//==========================================================

/**
 * Example: sequential promises with chaining
 */

console.log('fetching users');

db.getUsers()
.then(function (users) {

  console.log('found users');
  const harry = users.find(function (user) {
    return user.name === 'Harry Potter';
  });
  console.log('fetching harry potter tweets');
  return db.getTweetsByUserId(harry.id);

})
.then(function (tweets) {

  console.log('found harry potter tweets');
  console.log('Harry Potter tweets:', tweets);

})
.catch(function (err) {
  console.error('ERR!', err);
});

//============================================================

/**
 * Examples: parallel promises with `Promise.all`
 */

const usersPromise = db.getUsers();
const tweetsPromise = db.getTweets();

/**
 * Native promises
 * If promise value is an array, we can grab indexes off that array in handler
 */

Promise.all([usersPromise, tweetsPromise]) // --> promise for array of the results, in order
.then(function (results) {
  const usersArray = results[0];
  const tweetsArray = results[1];
  console.log(usersArray, tweetsArray);
})
.catch(function (err) {
  console.error('ERR', err);
});

/**
 *  Bluebird promises (not native)
 *  The `.spread` method spreads results array elements over function params
 */

// Promise.all([usersPromise, tweetsPromise]) // --> promise for array of the results, in order
// .spread(function (usersArray, tweetsArray) {
//   console.log(usersArray, tweetsArray);
// })
// .catch(function (err) {
//   console.error('ERR', err);
// });

/**
 * However, no need for `spread` in ES6, with array destructuring.
 * If function param is an array, we can name elements of the array.
 * This has nothing to do with promises per se, but it's useful for Promise.all.
 */

Promise.all([usersPromise, tweetsPromise]) // --> promise for array of the results, in order
.then(function ([usersArray, tweetsArray]) {
  console.log(usersArray, tweetsArray);
})
.catch(function (err) {
  console.error('ERR', err);
});

//===============================================================

/**
 * Example: `Promise.all` isn't magic. We can do similar stuff by hand.
 * But of course this is a lot uglier and more error-prone.
 * I am not even showing you erorr handling… don't do this, use `.all`!
 */

let users;
let tweets;
let count = 0;

db.getUsers()
.then(foundUsers => {
  users = foundUsers;
  count++;
  if (count < 2) doFinalStuffIf();
});

db.getTweets()
.then(foundTweets => {
  tweets = foundTweets;
  count++;
  if (count < 2) doFinalStuffIf();
});

function doFinalStuffIf () {
  console.log(users, tweets);
}
