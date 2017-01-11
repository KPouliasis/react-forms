'use strict';

function HashNode (key, value) {
  this.key = key;
  this.value = value;
}

HashNode.prototype.valueOf = function() {
  return this.key;
};

function HashTable () {
  this.buckets = new Array(35);
}

// example of a getter, just for kicks
Object.defineProperty(HashTable.prototype, 'numBuckets', {
  get: function () { return this.buckets.length; }
});

HashTable.prototype.set = function(key, value) {
  if (typeof key !== 'string') throw new TypeError('Keys must be strings');
  var index = this.hash(key);
  if (!this.buckets[index]) this.buckets[index] = new LinkedList();
  this.buckets[index].addToHead(new HashNode(key, value));
};

HashTable.prototype.get = function(key) {
  var index = this.hash(key);
  // first solution: use `valueOf` for key & hashNode comparison (unusual)
  // return this.buckets[index].search(key).value;
  // different solution: pass `search` a function that inspects hashNode directly to see if it has the right key (more typical JS solution)
  return this.buckets[index].search(function(hashNode){
    return hashNode.key === key;
  }).value;
};

HashTable.prototype.hasKey = function(key) {
  // return !!(this.get(key));
  var index = this.hash(key);
  return Boolean(this.buckets[index].search(function(hashNode){
    return hashNode.key === key;
  }));
};

HashTable.prototype.hash = function(key) {
  // // awkward reduction… sometimes a for loop is simpler
  // return key.split('').reduce(function(sum, letter){
  //   return sum + letter.charCodeAt(0);
  // }, 0) % this.numBuckets;
  var sum = 0;
  for (var i = 0; i < key.length; i++) {
    sum += key.charCodeAt(i);
  }
  return sum % this.numBuckets;
};
