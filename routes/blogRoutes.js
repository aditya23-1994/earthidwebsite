const express = require('express');
const blogController = require('../controllers/blogController');
const authController = require('../controllers/authController');

const router = express.Router();

//  Routes to CREATE and RETRIVE A BLOG
router.route('/').get(blogController.getAllBlogs).post(blogController.uploadBlogCover, blogController.createBlog);

//  Routes to FETCH, UPDATE & DELETE A BLOG
router
  .route('/:id')
  .get(blogController.getBlog)
  .patch(blogController.uploadBlogCover, blogController.updateBlog)
  .delete(authController.protect, authController.restrictTo('admin', 'writer'), blogController.deleteBlog);

module.exports = router;
