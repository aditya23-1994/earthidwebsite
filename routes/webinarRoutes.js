const express = require('express');
const webinarController = require('../controllers/webinarController');

const router = express.Router();

//  Routes to CREATE and RETRIVE A BLOG
router
  .route('/')
  .get(webinarController.getAllWebinars)
  .post(webinarController.uploadBlogCover, webinarController.createWebinar);

//  Routes to FETCH, UPDATE & DELETE A BLOG
router
  .route('/:id')
  .get(webinarController.getWebinar)
  .patch(webinarController.uploadBlogCover, webinarController.updateWebinar)
  .delete(webinarController.deleteWebinar);

module.exports = router;
