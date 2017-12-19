const express = require('express');
const mongoose = require('mongoose');
const Favorites = require('./../models/favorites');
const authenticate = require('./../authenticate');
const cors = require('./cors');
const bodyParser = require('body-parser');

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
  Favorites.findOne({user: req.user.id})
  .populate('user')
  .populate('dishes')
  .then(userFavorites => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(userFavorites);
    }, err => next(err))
  .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  Favorites.findOneAndUpdate(
    { user: req.user.id },
    { $addToSet: { dishes: { $each: req.body }}},
    { new: true, upsert: true })
  .then(userFavorites => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(userFavorites);
  }, err => next(err))
  .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  Favorites.findOneAndRemove({user: req.user.id})
  .then(done => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({'success': true, 'removedDoc': done});
  }, err => next(err))
  .catch(err => next(err))
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
  res.statusCode = 403;
  res.end('GET operation not supported on /favorites/' + req.params.dishId);
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  Favorites.findOneAndUpdate(
    { user: req.user.id },
    { $addToSet: { dishes: req.params.dishId }},
    { new: true, upsert: true })
  .then(userFavorites => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(userFavorites);
  }, err => next(err))
  .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /favorites/' + req.params.dishId);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  Favorites.findOneAndUpdate(
    { user: req.user.id },
    { $pull: { dishes: req.params.dishId }},
    { new: true })
  .then(result => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({'success': true, 'newUserFavorites': result});
  }, err => next(err))
  .catch(err => next(err));
});


module.exports = favoriteRouter;
