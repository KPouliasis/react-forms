var Sequelize = require('sequelize');
var db = require('./_db');

var Day = db.define('day', {
    number: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    hooks: {
        beforeDestroy: function (dayBeingDestroyed) {

            return Day.findAll({
                where: {
                    number: {
                        $gt: dayBeingDestroyed.number
                    }
                }
            })
                .then(function (daysAfter) {

                    var updatingDayNumbers = daysAfter.map(function (day) {
                        day.number--;
                        return day.save();
                    });

                    return Promise.all(updatingDayNumbers);

                });

        }
    }
});

module.exports = Day;