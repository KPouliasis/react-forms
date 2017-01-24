var Sequelize = require('sequelize');

var dbUrl = 'postgres://localhost:5432/testing-lecture';

var db = new Sequelize(dbUrl, {
    logging: false
});

var Student = db.define('student', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cohort: {
        type: Sequelize.STRING
    },
    campus: {
        type: Sequelize.ENUM(
            'Fullstack Academy',
            'Grace Hopper Academy',
            'Fullstack Academy Chicago'
        )
    }
}, {
    classMethods: {
        findByCampus: function (campusName) {
            return Student.findAll({
                where: {
                    campus: campusName
                }
            });
        }
    },
    instanceMethods: {
        getClassmates: function () {
            return Student.findAll({
                where: {
                    cohort: this.cohort,
                    campus: this.campus,
                    id: {
                        $ne: this.id
                    }
                }
            });
        },
        changeCohort: function (newCohort) {
            this.cohort = newCohort;
            return this.save();
        }
    }
});

module.exports = {
    Student: Student
};