const fs = require('fs');

function Table (folderPath) {
  this._folderPath = folderPath;
}

Table.toFilename = function (id) {
  // ex: 1 => 0001.json
  return ('0000' + id).slice(-4) + '.json';
};

// // template strings in es6
// Table.toFilename = function (id) {
//   // ex: 1 => 0001.json
//   return (`0000${id}.json`).slice(-9);
// };

Table.toId = function (filename) {
  // ex: 0001.json => 1
  return parseInt(filename);
};

Table.prototype.read = function (id) {
  // convert id to filepath
  const filename = Table.toFilename(id);
  const filepath = `${this._folderPath}/${filename}`;
  // synchonously read the file
  let contents;
  try {
    contents = fs.readFileSync(filepath);
  } catch (err) {
    return undefined;
  }
  // parse the result
  const row = JSON.parse(contents);
  return row;
};

Table.prototype.getRowIds = function () {
  // find all filepaths in our table folder
  const filenames = fs.readdirSync(this._folderPath);
  // convert them to ids
  const ids = filenames.map(function (filename) {
    return Table.toId(filename);
  });
  return ids;
};

module.exports = Table;