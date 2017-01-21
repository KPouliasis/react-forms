const Plan = require('./plan');

function FQL (table) {
  this._table = table;
  this._plan = new Plan();
}

FQL.prototype.get = function () {
  // reads all data from queried rows in table
  const rows = [];
  const ids = this._table.getRowIds();
  for (let i = 0; i < ids.length && this._plan.withinLimit(rows); i++) {
    const id = ids[i];
    const row = this._table.read(id);
    if (this._plan.matchesRow(row)) {
      // call plan's selectColumns method on each row
      const selectedRow = this._plan.selectColumns(row);
      rows.push(selectedRow);
    }
  }
  return rows;
};

FQL.prototype.count = function () {
  return this.get().length;
};

FQL.prototype.limit = function (amount) {
  this._plan.setLimit(amount);
  return this;
};

FQL.prototype.select = function () {
  if (arguments[0] === '*') return this;
  this._plan.setSelected([].slice.call(arguments));
  return this;
};

FQL.prototype.where = function (criteria) {
  this._plan.setCriteria(criteria);
  return this;
};

module.exports = FQL;