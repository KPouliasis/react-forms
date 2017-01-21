# Database Vocab

## DBMS

*Database management system*

A tool for communicating with a database in an easy way. Manages the data.

Come with their own query language, command line tools, GUIs, etc.

Examples: PostgreSQL, MySQL, MongoDB, RethinkDB, Redis, Neo4J, Riak

Not a DBMS: file.

"SQL" is not technically a DMBS...

Sometimes people will talk about "SQL DMBS", or "relational DBMS".

## Query language

SQL is a query language.

Other example: DOM, e.g. `querySelectorAll`.

## Database

The actual "file" where the data stored, or something like a file.

What differentiates a database from this file "lecture-notes.md"? What differentiates a phone book from a database (arguably it *is* a database)? For us as programmers? What differentiates it from an array in our Javascript program (arguably it *is* a database)?

Pseudo-requirements:

### Structured data
- Organization
- Identifiable
- Maybe there are types
- Maybe there are tables

### Accessible
- Often shared by many people
- "Easy" to update / read
- Queryable from a computer, i.e. programmably

### Persistent
- We can shut off our computer and turn it on again and the database is still there
- This is actually a scale, depending on what might happen

## Relation

What is it?

A relationship between entities in our databases. Example: teams, roster, score, games—teams might have a game which has a score. Those things are "relations".

Yes! But also: NO! Technically a relation is a "table".

## Analogy

DBMS : database :: whitepages (the organization) : phone book
DBMS : database :: the person reading it : phone book

## Query plan

This is something a DBMS might use when given a query. It represents the TODO list of the query, but does not execute it.

Example: OmriQL 'GET CEREAL'
Query plan: 'STAND UP', 'GO TO KITCHEN', 'FIND BOWL', 'POUR CEREAL', 'RETURN', 'EAT'

Especially relevant for SQL, which is declarative.

## Maintain a database

Monitor performance and optimize it—changing indexes, keys, altering queries. Deal with permissions / security. Deal with scale.

---

# The workshop

You'll be building a DBMS in Javascript, in Node. And kinda of a query language to go with it.

## Data

You've got json files in a folder. Think of each file as a "row", and the folder that contains it as a "table".

## Classes

- `Table`
- `FQL`
- `Plan`

---

# Javascript

## Static methods (class methods)

What is it? Attached directly to the constructor.

Perfect example: `Object.keys`. You do `Object.keys(foo)` NOT `foo.keys()`.

```js
var allThings = [];
function Thing (name) {
  this.name = name;
  allThings.push(this);
}
Thing.find = function (name) {
  // never uses `this`
  for (var i = 0; i < allThings.length; i++) {
    if (allThings[i].name === name) {
      return allThings[i];
    }
  }
};
Thing.find('pencil');
```

Why do this? If we don't need it on an instance. If the logic of our method is not concerned with any particular instance, it might as well be a static / class method.

## Instance methods

What is it? Attached to instance (or accessible via the prototype chain).

```js
function Thing (name) {
  this.name = name;
}
Thing.prototype.jumpUpAndDown = function (name) {
  this.jumping = true;
};
var thingA = new Thing('mouse');
thingA.jumpUpAndDown();
```

## `JSON.parse`

Takes a "string that looks like an object" and returns an actual object.

## `JSON.stringify`

Takes an object and returns a string that looks like it.

## File system

We use the `'fs'` module, built into node.

If we want to read a file: `fs.readFile` OR `fs.readFileSync`.

`fs.readFileSync` takes a path to a file and returns the file contents as a "string". We're doing it syncrhonously, which means it's blocking.

Normally this is a bad idea: our javascript program can't "keep going" onto the next line. BUT for FQL it makes things so much more straightforward.

---

# Indexing

What is it? More or less another table that refers to the original. This other, index table has column values as keys and indexes / ids as values.

The whole point is to make queries faster. Think about a glossary.
