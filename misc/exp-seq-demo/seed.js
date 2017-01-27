'use strict';

const db = require('./server/db');

const Beast = db.models.beast;

db.sync({ force: true })
.then(() => {
  console.log('synced');
  // const makingBeasts = [{
  //   name: 'Orc',
  //   whereToFindIt: 'Mordor'
  // }, {
  //   name: 'Hippogriff',
  //   whereToFindIt: `Hagrid's hut`
  // }, {
  //   name: 'Thestral'
  // }].map(beast => {
  //   return Beast.create(beast);
  // });
  // return Promise.all(makingBeasts);
  return Beast.bulkCreate([{
    name: 'Orc',
    whereToFindIt: 'Mordor'
  }, {
    name: 'Hippogriff',
    whereToFindIt: `Hagrid's hut`
  }, {
    name: 'Thestral'
  }]);
})
.then(beasts => {
  console.log(`Made ${beasts.length} beasts`);
})
.catch(err => {
  console.error(err);
})
.finally(() => {
  db.close();
  return null;
});
