const Plan = require('./plan');

function FQL (table) {
  this._table = table;
  this.plan = new Plan();
}

FQL.merge = function (objA, objB) {
  return Object.assign({}, objA, objB);
};

FQL.prototype.count = function () {
  return this.get().length;
};

FQL.prototype._map = function (iter) {
  const ids = this.plan.getIndexedIds(this._table);
  const rows = [];
  for (let index = 0; index < ids.length && this.plan.withinLimit(rows); index++) {
    const id = ids[index];
    const initialRow = this._table.read(id);
    if (this.plan.matchesRow(initialRow)) {
      rows.push(iter(initialRow, id));
    }
  }
  return this.plan.execJoins(rows, FQL.merge);
};

FQL.prototype.get = function () {
  return this._map(row => {
    return this.plan.selectColumns(row);
  })
};

FQL.prototype.delete = function () {
  return this._map((row, id) => {
    this._table.erase(id);
    return this.plan.selectColumns(row);
  });
};

FQL.prototype.set = function (changes) {
  return this._map((row, id) => {
    const newRow = this._table.update(id, changes);
    return this.plan.selectColumns(newRow);
  });
};

FQL.prototype.limit = function (amount) {
  this.plan.setLimit(amount);
  return this;
};

FQL.prototype.select = function (...columns) {
  if (columns[0] !== '*') {
    this.plan.setSelected(columns);
  }
  return this;
};

FQL.prototype.where = function (criteria) {
  const indexedCriteria = {};
  const scanCriteria = {};
  Object.keys(criteria).forEach(column => {
    const cond = criteria[column];
    if (typeof cond !== 'function' && this._table.hasIndexTable(column)) {
      indexedCriteria[column] = cond;
    } else {
      scanCriteria[column] = cond;
    }
  });
  this.plan.setIndexedCriteria(indexedCriteria);
  this.plan.setCriteria(scanCriteria);
  return this;
};

FQL.prototype.innerJoin = function (foreignFql, rowMatcher) {
  this.plan.addJoin(foreignFql, rowMatcher);
  return this;
};

module.exports = FQL;