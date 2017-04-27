'use strict';

const express = require('express');
const bodyParser = require('body-parser');

function getModel () {
  return require(`./model-${require('../config').get('DATA_BACKEND')}`);
}

const router = express.Router();

router.use(bodyParser.json());

/**
 * Endpoint for home page
 */
router.get('/', (req, res, next) => {
  getModel().list(10, req.query.pageToken, (err, entities, cursor) => {
    if (err) {
      next(err);
      return;
    }
    res.json({
      items: entities,
      nextPageToken: cursor
    });
  });
});

/**
 * Endpoint to publish new Advertisement
 */
router.post('/', (req, res, next) => {
  getModel().create(req.body, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    res.json(entity);
  });
});

/**
 * Endpoint to get Advertisement details
 */
router.get('/:ad', (req, res, next) => {
  getModel().read(req.params.ad, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    res.json(entity);
  });
});

/**
 * Endpoint to update an Advertisement
 */
router.put('/:ad', (req, res, next) => {
  getModel().update(req.params.ad, req.body, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    res.json(entity);
  });
});

/**
 * DEndpoint to delete an Advertisement
 */
router.delete('/:ad', (req, res, next) => {
  getModel().delete(req.params.ad, (err) => {
    if (err) {
      next(err);
      return;
    }
    res.status(200).send('OK');
  });
});

/**
 * Errors on "/api/advertisement/*" routes.
 */
router.use((err, req, res, next) => {
  //create error object to display error with message
  err.response = {
    message: err.message,
    internalCode: err.code
  };
  next(err);
});

module.exports = router;
