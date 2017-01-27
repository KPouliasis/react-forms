'use strict';

const Sequelize = require('sequelize');

const db = new Sequelize('postgres://localhost/tripplanner');

module.exports = db;
