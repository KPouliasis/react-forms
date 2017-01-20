const pg = require('pg');
const client = new pg.Client('postgres://localhost/twitterdb');

client.connect();

module.exports = client;
