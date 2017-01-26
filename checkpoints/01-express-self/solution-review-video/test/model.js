var expect = require('chai').expect;

var Todos = require('../models/todos');
describe('Todo model', function() {

  // every test starts with a clean slate (see todos.js)
  beforeEach(function() {
    Todos.reset();
  });

  describe('`listPeople` and `add`', function() {
    it('initially returns an empty array', function() {
      expect(Todos.listPeople()).to.eql([]);
    });

    it('lists people after they have todos added', function() {
      Todos.add('zeke', { content: 'clean room' });
      expect(Todos.listPeople()).to.eql(['zeke']);
    });

    it('handles multiple people with multiple todos', function(){
      Todos.add('zeke', { content: 'clean room' });
      Todos.add('zeke', { content: 'write mom' });
      expect(Todos.listPeople()).to.eql(['zeke']);
      Todos.add('omri', { content: 'exercise' });
      expect(Todos.listPeople()).to.eql(['zeke', 'omri']);
    });
  });

  describe('`add` and `list`', function() {
    it('remembers who does what', function() {
      Todos.add('zeke', { content: 'clean bath room' });
      expect(Todos.list('zeke')).to.have.length(1);
      Todos.add('omri', { content: 'clean living room' });
      expect(Todos.list('omri')).to.have.length(1);
      Todos.add('omri', { content: 'clean garage' });
      expect(Todos.list('omri')).to.have.length(2);
    });

    it('returns the task that was created', function() {
      var originalTask = { content: 'clean up specs' };
      var returnedTask = Todos.add('zeke', originalTask);
      expect(originalTask).to.equal(returnedTask);
    });
  });

  describe('`complete`', function() {
    it('has a `complete` boolean set to false for any new tasks', function() {
      Todos.add('zeke', { content: 'clean self' });
      expect(Todos.list('zeke')[0].complete).to.be.false;
    });

    it("sets a specified task's `complete` property to true", function() {
      Todos.add('zeke', { content: 'go to store' });
      Todos.complete('zeke', 0);
      expect(Todos.list('zeke')[0].complete).to.be.true;
    });
  });

  describe('`remove`', function() {
    it('removes a task, by index, for a given person', function() {
       Todos.add('zeke', { content: 'task 0' });
       Todos.add('zeke', { content: 'task 1' });
       Todos.add('zeke', { content: 'task 2' });
       Todos.remove('zeke', 1);
       expect(Todos.list('zeke')[1].content).to.equal('task 2');
    });
  });
});
