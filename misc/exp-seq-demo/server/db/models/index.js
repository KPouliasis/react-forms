'use strict';

const Sequelize = require('sequelize');
const db = require('../db');

const Beast = db.define('beast', {

  // attributes: columns that go in the actual db!

  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isAlpha: true
    }
  },

  whereToFindIt: {
    type: Sequelize.STRING
  }

}, {

  // options: things that affect our Sequelize JS objects!

  classMethods: {

    // funcs that can be called directly on the `Beast` model

    findLocated: function () {
      return Beast.findAll({
        where: {
          whereToFindIt: {
            $ne: null
          }
        }
      });
    },

    getLocations: function () {
      return Beast.findLocated()
      .then(function (beasts) {
        return beasts
        .map(function (beast) {
          return beast.whereToFindIt;
        });
      });
    },

  },

  instanceMethods: {

    // funcs that can be called on a single `beast`

    changeName: function (newName) {

      // if a function makes a promise, it should return that promise so the *calling code* can use it!

      return this.update({
        name: newName
      });
    }

  }

});


// Beast.getLocations()
// .then(function (locations) {
//   console.log(locations);
// })
// .catch(console.error.bind(console));

Beast.findOne()
.then(function (beast) {
  return beast.changeName('Bob'); // if `changeName` didn't return a promise, we'd end up in the next step too soon! `result` would be undefined. :-(
})
.then(function (result) {
  console.log(result.dataValues)
})
.catch(console.error.bind(console));
