var express = require('express');
var router = express.Router();
var Model = require('../model/model');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/mock/feeds', function(req, res, next) {
  let feed = require('../utils/feed')
  res.json(feed.getFeed())
})

router.get('/mock/review/:id', function(req, res, next) {
  let getFeed = require('../utils/getFeed')
  res.json(getFeed.findFeed(req.params.id))
})

router.get('/feeds', function(req, res, next) {
  Model.getAllReview()
  .then((data) => res.status(200).send(data))
  .catch((err) => res.status(err.code).send(err))
})

router.get('/review/:reviewId', function(req, res, next) {
  Model.getReviewById(req.params.reviewId)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(err.status).send(err.message))
})

router.post('/subscribe', function(req, res, next) {
  Model.subscribe(req.body.subscriber, req.body.follower)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(err.status).send(err.message))
})

router.post('/post', function(req, res, next) {
  Model.postReview({
    uId: req.body.uId, 
    bookName: req.body.bookName, 
    reviewTitle: req.body.reviewTitle, 
    reviewContent: req.body.reviewContent
  })
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err))
})
 
router.post('/comment', function(req, res, next) {
  Model.comment({
    uId: req.body.uId,
    reviewId: req.body.reviewId,
    reviewContent: req.body.reviewContent
  })
  .then(data => res.status(200).send(data))
  .catch(err => res.status(err.status).send(err.message))
})
module.exports = router;



