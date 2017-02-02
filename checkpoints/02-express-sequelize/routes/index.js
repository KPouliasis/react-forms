var express = require('express');
var router = express.Router();

var Article = require('../models/article');

router.get('/articles', function (req, res, next) {
  Article.findAll()
  .then(function (articles) {
    res.json(articles);
  })
  .catch(next);
});

router.get('/articles/:id', function (req, res, next) {
  Article.findById(req.params.id)
  .then(function (article) {
    if (!article) res.sendStatus(404);
    else res.json(article);
  })
  .catch(next);
});

router.post('/articles', function (req, res, next) {
  Article.create(req.body)
  .then(function (created) {
    res.json({
      message: 'Created successfully',
      article: created
    });
  })
  .catch(next);
});

// best solution uses one query and postgreSQL `returning` capability
router.put('/articles/:id', function (req, res, next) {
  Article.update(req.body, {
    where: {id: req.params.id},
    returning: true
  })
  .then(function (results) {
    var updated = results[1][0];
    res.json({
      message: 'Updated successfully',
      article: updated
    });
  })
  .catch(next);
});

// // more fundamental but verbose solution using two queries
// router.put('/articles/:id', function (req, res, next) {
//   Article.findById(req.params.id)
//   .then(function (found) {
//     if (!found) {
//       var err = new Error('not found');
//       err.status = 404;
//       throw err;
//     }
//     return found.update(req.body);
//   })
//   .then(function (updated) {
//     res.json({
//       message: 'Updated successfully',
//       article: updated
//     });
//   })
//   .catch(next);
// });

module.exports = router;
