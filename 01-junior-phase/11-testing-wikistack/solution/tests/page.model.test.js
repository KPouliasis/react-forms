var Promise = require('bluebird');
var chai = require('chai');
chai.use(require('chai-things'));
var expect = chai.expect;
var Page = require('../models').Page;
var User = require('../models').User;

describe('Page model', function () {

    beforeEach(function (done) {
        //sync User and Page models. Drop and recreate tables
        User.sync({force: true})
            .then(function () {
                return Page.sync({force: true})
            })
            .then(function(){
                done();
            })
            .catch(done)
    });

    describe('Virtuals', function () {

        var page;
        beforeEach(function () {
            page = Page.build({
                urlTitle: 'May_the_4th',
                content: '# Jedis'
            });
        });

        describe('route', function () {

            it('returns the url title prepended by "/wiki/"', function () {
                expect(page.route).to.equal('/wiki/May_the_4th');
            });

        });

        describe('renderedContent', function () {

            it('converts the markdown-formatted content into HTML', function () {
                expect(page.renderedContent.trim()).to.equal('<h1 id="jedis">Jedis</h1>');
            });

        });

    });

    describe('Statics', function () {

        describe('findByTag', function () {

            beforeEach(function () {
                // Returning a promise instead of using done
                return Promise.all([
                    Page.create({
                        title: 'Test Page 1',
                        content: 'This is content 1',
                        tags: ['misc', 'test', 'star-wars']
                    }),
                    Page.create({
                        title: 'Test Page 2',
                        content: 'Other stuff',
                        tags: ['misc', 'star-wars', 'fsa']
                    })
                ]);
            });

            it('gets pages with the search tag', function (done) {
                // try searching by tag in db
                // get back stuff with that tag
                Page.findByTag('test')
                    .then(function (pages) {
                        expect(pages).to.have.lengthOf(1);
                        expect(pages[0].title).to.equal('Test Page 1');
                        done();
                    })
                    .catch(done);
            });

            it('does not get pages without the search tag', function () {
                // Returning a promise instead of using done
                return Page.findByTag('foobar')
                    .then(function (pages) {
                        expect(pages).to.have.lengthOf(0);
                    });
            });

        });

    });

    describe('Methods', function () {

        describe('findSimilar', function () {

            var rosePage, berryPage, bananaPage;
            beforeEach(function () {
                return Promise.all([
                    Page.create({
                        title: 'Rose',
                        content: 'Pretty flowers, watch out for thorns',
                        tags: ['flower', 'red']
                    }),
                    Page.create({
                        title: 'Strawberry',
                        content: 'Edible things, dip in chocolate',
                        tags: ['red', 'fruit']
                    }),
                    Page.create({
                        title: 'Banana',
                        content: 'Edible things, dip in peanut butter',
                        tags: ['fruit', 'yellow']
                    })
                ])
                    .spread(function (_p1, _p2, _p3) {
                        rosePage = _p1;
                        berryPage = _p2;
                        bananaPage = _p3;
                    });
            });

            it('never gets itself', function () {
                berryPage.findSimilar()
                    .then(function (similar) {
                        // chai-things at work
                        expect(similar).to.not.contain.a.thing.with.property('id', berryPage.id);
                    });
            });

            it('gets other pages with any common tags', function () {
                return berryPage.findSimilar()
                    .then(function (similar) {
                        expect(similar).to.have.lengthOf(2);
                        expect(similar).to.contain.a.thing.with.property('id', rosePage.id);
                        expect(similar).to.contain.a.thing.with.property('id', bananaPage.id);
                    });
            });

            it('does not get other pages without any common tags', function () {
                return bananaPage.findSimilar()
                    .then(function (similar) {
                        expect(similar).to.have.lengthOf(1);
                        expect(similar).to.contain.a.thing.with.property('id', berryPage.id);
                    })
            });

        });

    });

    describe('Validations', function () {

        it('errors without title', function () {
            var page = Page.build({});
            return page
                .validate()
                .then(function (err) {
                    expect(err).to.exist;
                    expect(err.errors).to.contain.a.thing.with.property('path', 'title');
                });
        });

        it('errors without content', function () {
            var page = Page.build({});
            return page
                .validate()
                .then(function (err) {
                    expect(err).to.exist;
                    expect(err.errors).to.contain.a.thing.with.property('path', 'content');
                });
        });

        it('errors given an invalid status', function () {
            var page = Page.build({
                title: 'kjkja',
                content: 'asdjka',
                status: 'evil'
            });
            return page
                .save()
                .then(function () {
                    throw Error('Promise should have rejected');
                }, function (err) {
                    expect(err).to.exist;
                    expect(err.message).to.contain('status');
                });
        });

        it('will be valid with the above stuff', function () {
            var page = Page.build({
                title: 'Foobar',
                content: 'Foos and bars but together'
            });
            return page.save();
        });

    });

    describe('Hooks', function () {

        it('it sets urlTitle based on title before validating', function () {

            var page = Page.build({
                title: 'The Who',
                content: 'A band on first base'
            });

            return page.save()
                .then(function () {
                    expect(page.urlTitle).to.equal('The_Who');
                });
        });

    });

});