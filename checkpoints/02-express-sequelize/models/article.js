'use strict';

var db = require('./database');
var Sequelize = require('sequelize');

// Make sure you have `postgres` running!

var User = require('./user');

//---------VVVV---------  your code below  ---------VVV----------

var Article = db.define('article', {

  title: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  version: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  tags: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    defaultValue: [],
    get: function () {
      return this.getDataValue('tags').join(', ');
    }
  }

}, {

  getterMethods: {
    snippet: function () {
      if (!this.content) return ''; // needed for Article.update, oddly
      return this.content.slice(0, 23) + '...';
    }
  },
  instanceMethods: {
    truncate: function (len) {
      this.content = this.content.slice(0, len);
    }
  },
  classMethods: {
    findByTitle: function (title) {
      return this.findOne({where: {title: title}});
    }
  },
  hooks: {
    // note that the `beforeSave` hook is documented but not yet released
    beforeUpdate: function (article) {
      article.version++;
    }
  }

});

Article.belongsTo(User, {as: 'author'});

//---------^^^---------  your code above  ---------^^^----------

module.exports = Article;
