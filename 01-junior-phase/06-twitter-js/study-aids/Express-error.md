# Normal vs. Error-Handling Middleware

## Normal

In Express, "normal" middleware is a function that takes zero to three arguments (typically named `req`, `res`, and `next`). JavaScript can tell how many formal (named) arguments a function takes — known as the *arity* of the function — by checking that function's `.length`.

```js
function foo (a, b, c) {}
console.log(foo.length) // 3
```

When supplied to `app.use`, normal middleware is called on each incoming request. For three middleware functions registered, the second will only run after the first calls `next`, and the third will only run after the second calls `next`:

```js
app.use(function middle1 (req, res, next) {
  // runs first
  next(); // go to middle2
})

app.use(function middle2 (req, res, next) {
  // runs second
  next(); // go to middle3
})

app.use(function middle3 (req, res, next) {
  // runs third
  res.send('the end');
})
```

## Error Handling

Conversely, *error-handling middleware* are functions with arity four:

```js
app.use(function dealWithErrors (err, req, res, next) {
  console.error(err);
  res.status(500).send('oops');
})
```

Unlike normal middleware, the first argument will be called with the error. The next three arguments (arg2, arg3, arg4) correspond to the first three arguments of normal middleware (the request object, response object, and next function).

If an app works properly, error-handling middleware is not called. But we can *skip straight to error-handling middleware* at any time if either of two things happen:

* If a value is `throw`n inside of any middleware function
* If a truthy value is passed to the `next` function

In the following code snippet, if `grumpy` is true, `normal1` will execute and then `dealWithErrors` will execute, totally skipping `normal2`.

```js
app.use(function normal1 (req, res, next) {
  if (grumpy) throw new Error('I skip normal2!');
  else next();
})

app.use(function normal2 (req, res, next) {
  res.send('everything is fine')
})

app.use(function dealWithErrors (err, req, res, next) {
  console.error(err); // err is an error object with message 'I skip normal2!'
  res.status(500).send('oops');
})
```

We can use `next` to deliberately jump to error handlers. This is useful e.g. in async callbacks:

```js
router.get('/kittens', function (req, res, next) {
  KittenBank.findAll(function (err, results) {
    if (err) next(err);
    else res.json(results);
  });
});
```

## Conclusion

Please let me know if you have any questions. This isn't a *huge* aspect of what we teach in Express but it is good to know and can let you handle errors in a more centralized way.