function Plan () {}

Plan.prototype.setLimit = function (amount) {
  this._limit = amount;
};

Plan.prototype.withinLimit = function (rows) {
  if (!this.hasOwnProperty('_limit')) return true;
  return rows.length < this._limit;
};

Plan.prototype.setSelected = function (columns) {
  this._selected = columns;
};

Plan.prototype.selectColumns = function (row) {
  if (!this.hasOwnProperty('_selected')) return row;
  const selectedRow = {};
  this._selected.forEach(function (col) {
    selectedRow[col] = row[col];
  });
  return selectedRow;
};

Plan.prototype.setCriteria = function (criteria) {
  this._criteria = criteria;
};

Plan.prototype.matchesRow = function (row) {
  const criteria = this._criteria;
  // return bool for whether it matches based on the criteria
  for (let col in criteria) {
    const cond = criteria[col];
    const val = row[col];
    if (typeof cond === 'function') {
      if (!cond(val)) {
        return false;
      }
    } else if (val !== cond) {
      return false;
    }
  }
  return true;
};

module.exports = Plan;