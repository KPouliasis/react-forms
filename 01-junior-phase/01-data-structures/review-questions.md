# Review Questions

* Resources à la Codeschool &c.
  * Khan Academy
  * Stanford course?
  * MIT?
  * VisuAlgo.net
  * CLRS (Cormen et al — very mathy / proofy one)
  * Skiena — Algorithm Design Manual (still long and detailed, but slightly more approachable)
    * Lectures online: http://www3.cs.stonybrook.edu/~skiena/
  * Cracking the Code Interview (probably should get this in any case!)

* BFS — recursive? How to know when and when not?
  * in BFS's case, it's not immediately obvious that the solution ISN'T recursive. So don't worry if you tried that route. Most of what we do with BSTs can be recursive, so it was a natural thing to attempt even if in this case it didn't work out.
  * Gabriel's steps to solve recursion:
    1. Figure out the base case. This is a VERSION OF AN INPUT that doesn't need recursion — i.e., you know how to solve it.
    2. Once you have the base case, start thinking ONE STEP BACK in recursion.
      - recursion and base case are exclusive; you'll need conditional statements.
      - inside recursive case… RECURSE (lol)
    3. PROFIT?

* LL#search (normalizing string vs. function)

* Style?
  * Instructor solutions… sometimes
  * AirBnB style guide
  * ESLint config fullstack (Toolbox workshop / ask Gabriel for help)

* Ways to set `this`
  * `call`, `apply`, `bind` (set `this` directly)
  * `new` (`this` is new object)
  * default is `global` / `window` (non-strict mode), `undefined` (strict)
  * dot notation calls (`this` is the object to the left of the dot)
  * some builtins take a param for `this`. Example:
    - `[1, 2, 3].forEach(function (num) { ... }, context)`
  * arrow functions: `(param1, param2) => param1 + param2`
    - _totally different_ from the above. All other methods of setting `this` are _dynamic_ — changes according to _how the function is called._ In arrow functions, `this` is inherited from whatever the surrounding scope's `this` is currently set to.
