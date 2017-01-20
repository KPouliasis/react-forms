/**
 * This is a fake (simulated) database for the lecture demo.
 * It isn't necessary to get anything that's happening in this file.
 * Rather, check out `index.js` to see how our fake db functions return
 * promises which we end up using (calling `.then` on).
 */

const slowPromise = (val, shouldFail) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) reject(val);
      else resolve(val);
    }, 800);
  });
};

const users = {
  1: {id: 1, name: 'Harry Potter', pet: 'owl'},
  2: {id: 2, name: 'Hermione Granger', pet: 'cat'},
  3: {id: 3, name: 'Ron Weasley', pet: 'disguised human'},
  4: {id: 4, name: 'Draco Malfoy', pet: 'henchmen'}
};

const tweets = {
  1: {userId: 1, content: 'hello'},
  2: {userId: 2, content: 'bye'},
  3: {userId: 2, content: 'WinGARdium LeviOOOHsa'},
  4: {userId: 1, content: 'I like magic!'}
};

module.exports = {
  getUsers: function () {
    const usersArray = Object.values(users);
    return slowPromise(usersArray);
  },
  getTweets: function () {
    const tweetsArr = Object.values(tweets);
    return slowPromise(tweetsArr);
  },
  getTweetsByUserId: function (id) {
    const tweetsForUser = Object.values(tweets)
    .filter(tweet => tweet.userId === id);
    return slowPromise(tweetsForUser);
  }
};
