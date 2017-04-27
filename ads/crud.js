'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const images = require('../lib/images');

function getModel () {
  return require(`./model-${require('../config').get('DATA_BACKEND')}`);
}

const router = express.Router();

// Automatically parse request body as form data
router.use(bodyParser.urlencoded({ extended: false }));

// Set Content-Type for all responses for these routes
router.use((req, res, next) => {
  res.set('Content-Type', 'text/html');
  next();
});

/**
 * Endpoint to display 10 items per page
 */
router.get('/', (req, res, next) => {
  getModel().list(10, req.query.pageToken, (err, entities, cursor) => {
    if (err) {
      next(err);
      return;
    }
    res.render('ads/list.jade', {
      ads: entities,
      nextPageToken: cursor
    });
  });
});

/**
 * Endpoint to add advertisement
 */
router.get('/add', (req, res) => {
  res.render('ads/form.jade', {
    ad: {},
    action: 'Add'
  });
});

/**
 * Endpoint to add advertisement
 */
router.post(
  '/add',
  images.multer.single('image'),
  images.sendUploadToGCS,
  (req, res, next) => {
    let data = req.body;

    if (req.file && req.file.cloudStoragePublicUrl) {
      data.imageUrl = req.file.cloudStoragePublicUrl;
    }

    // Save the data to the database.
    getModel().create(data, (err, savedData) => {
      if (err) {
        next(err);
        return;
      }
      res.redirect(`${req.baseUrl}/${savedData.id}`);
    });
  }
);

/**
 * Endpoint to show advertisement details
 */
router.get('/:ad/edit', (req, res, next) => {
  getModel().read(req.params.ad, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    res.render('ads/form.jade', {
      ad: entity,
      action: 'Edit'
    });
  });
});

/**
 * Endpoint to edit advertisement details
 */
router.post(
  '/:book/edit',
  images.multer.single('image'),
  images.sendUploadToGCS,
  (req, res, next) => {
    let data = req.body;

    if (req.file && req.file.cloudStoragePublicUrl) {
      req.body.imageUrl = req.file.cloudStoragePublicUrl;
    }

    getModel().update(req.params.book, data, (err, savedData) => {
      if (err) {
        next(err);
        return;
      }
      res.redirect(`${req.baseUrl}/${savedData.id}`);
    });
  }
);

/**
 * Endpoint to get advertisement details
 */
router.get('/:ad', (req, res, next) => {
  getModel().read(req.params.ad, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    res.render('ads/view.jade', {
      ad: entity
    });
  });
});

/**
 * Endpoint to edit advertisement details
 */
router.get('/:ad/delete', (req, res, next) => {
  getModel().delete(req.params.ad, (err) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect(req.baseUrl);
  });
});

/**
 * Errors on "/ads/*" routes.
 */
router.use((err, req, res, next) => {
  err.response = err.message;
  next(err);
});

module.exports = router;
