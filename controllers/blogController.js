const multer = require('multer');
const Blog = require('../models/blogModel');

const multerStorage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, 'public/img/blogs');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `blog-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  console.log(file);
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    Error('cant find the file');
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadBlogCover = upload.any();
//   TO CREATE A BLOG
exports.createBlog = async (req, res) => {
  if (req.files && req.files.length > 0) {
    req.body.coverImage = req.files[0].filename;
  }
  try {
    const newBlog = await Blog.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        blog: newBlog,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// TO RETRIVE ALL BLOG
exports.getAllBlogs = async (req, res) => {
  try {
    // TO BUILD A QUERY
    let query = Blog.find();

    // feature 1.) Sorting ...
    if (req.query.sort) {
      query = query.sort(req.query.sort);
    } else {
      query = query.sort('-publishedAt');
    }

    // feature 2.) Limiting the Fields to reduce the BandWidth on request...
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // feature 3.) PAGINATION SERVER SIDE...
    const page = req.query.page * 1 || 1; //  To convert string to number
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      //  RETURNS NO PAGE OR 404 ERROR iF PAGE IS NOT AVAILABLE...
      const numBlogs = await Blog.countDocuments();
      if (skip >= numBlogs) throw new Error('This page does not exists!');
    }

    //  TO EXECUTE A QUERY!
    const blogs = await query;

    res.status(200).json({
      status: 'success',
      results: blogs.length,
      data: {
        blogs,
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// RETRIVE A BLOG
exports.getBlog = async (req, res) => {
  try {
    // QUERY to grab the data from the database...
    const blog = await Blog.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        blog,
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// TO UPDATE A BLOG
exports.updateBlog = async (req, res) => {
  if (req.files && req.files.length > 0) {
    req.body.coverImage = req.files[0].filename;
  }
  console.log(req.body.coverImage);
  try {
    const updateBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        blog: updateBlog,
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// TO DELETE A BLOG
exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      //   message: `the blog with title: ${deleteBlog.title} has been deleted successfully!`
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
