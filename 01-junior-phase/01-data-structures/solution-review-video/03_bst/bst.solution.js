'use strict';

function BinarySearchTree (value) {
  this.value = value;
  this.magnitude = 1;
}

BinarySearchTree.prototype.insert = function(value) {
  this.magnitude++;
  var direction = value < this.value ? 'left' : 'right';
  if (!this[direction]) this[direction] = new BinarySearchTree(value);
  else this[direction].insert(value);
};

BinarySearchTree.prototype.contains = function(value) {
  if (this.value === value) return true;
  var direction = value < this.value ? 'left' : 'right';
  if (this[direction]) return this[direction].contains(value);
  else return false;
};

BinarySearchTree.prototype.depthFirstForEach = function(iterator, order) {
  if (order === 'pre-order') iterator(this.value);
  if (this.left) this.left.depthFirstForEach(iterator, order);
  if (!order || order === 'in-order') iterator(this.value);
  if (this.right) this.right.depthFirstForEach(iterator, order);
  if (order === 'post-order') iterator(this.value);
  // // alternate example of using an explicit stack to implement pre-order traversal. In-order and post-order are also possible… slightly less elegant however.
  // var stack = [this];
  // var tree;
  // while (stack.length) {
  //   tree = stack.pop();
  //   iterator(tree.value);
  //   if (tree.right) stack.push(tree.right);
  //   if (tree.left) stack.push(tree.left);
  // }
};

BinarySearchTree.prototype.breadthFirstForEach = function(iterator) {
  var queue = [this];
  var tree;
  while (queue.length) {
    tree = queue.shift();
    iterator(tree.value);
    if (tree.left) queue.push(tree.left);
    if (tree.right) queue.push(tree.right);
  }
};

BinarySearchTree.prototype.size = function(value) {
  return this.magnitude; // O(1) time
  // // alternative by walking the tree in O(n) time
  // var size = 0;

  // if (this) { size++ }
  // size += this.left && this.left.size()
  // size += this.right && this.right.size()

  // return size;
};
