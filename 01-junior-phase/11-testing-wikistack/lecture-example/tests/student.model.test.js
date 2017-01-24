const models = require('../models');
const Student = models.Student;
const chai = require('chai');
const expect = chai.expect;

describe('Student model', function () {

    beforeEach('Sync and empty our student table', function (done) {
        Student.sync({force: true})
            .then(function () {
                done();
            })
            // .catch(function (err) {
            //     done(err);
            // })
            .catch(done);
    });

    beforeEach('Populate information', function () {

        var creatingStudent1 = Student.create({
            name: 'Mariana',
            campus: 'Grace Hopper Academy',
            cohort: '1610GH'
        });

        var creatingStudent2 = Student.create({
            name: 'Ali',
            campus: 'Fullstack Academy',
            cohort: '1607FSA'
        });

        var creatingStudent3 = Student.create({
            name: 'Emily',
            campus: 'Grace Hopper Academy',
            cohort: '1607GH'
        });

        return Promise.all([
            creatingStudent1,
            creatingStudent2,
            creatingStudent3
        ]);

    });

    it('should exist', function () {
        expect(Student).to.be.an('object');
    });

    describe('findByCampus class method', function () {

        it('should exist', function () {
            expect(Student.findByCampus).to.be.a('function');
        });

        it('should give us back Emily and Mariana when called with GHA', function () {

            return Student.findByCampus('Grace Hopper Academy')
                .then(function (foundStudents) {
                    const justNames = foundStudents.map(function (student) {
                        return student.name;
                    }).sort();
                    return justNames;
                })
                .then(function (names) {
                    expect(names).to.be.deep.equal(['Emily', 'Mariana']);
                });

        });

    });

});

