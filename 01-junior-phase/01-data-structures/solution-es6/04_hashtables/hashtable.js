class HashNode {
  constructor(key, val) {
    this.value = val;
    this.key = key;
  }
}

class HashTable {
  constructor() {
    this.numBuckets = 35;
    this.buckets = new Array(35);
  }
  set(key, val) {
    if (typeof key !== 'string') throw new TypeError('Keys must be strings');
    let hash = this.hash(key);
    if (!this.buckets[hash]) this.buckets[hash] = new LinkedList();
    this.buckets[hash].addToHead(new HashNode(key, val));
  }
  get(key) {
    let hash = this.hash(key);
    return this.buckets[hash].search(node => node.key === key).value;
  }
  hasKey(key) {
    let hash = this.hash(key);
    return Boolean(this.buckets[hash].search(node => node.key === key));
  }
  hash(str) {
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
      sum += str.charCodeAt(i)
    }
    return sum % this.numBuckets;
  }
}
