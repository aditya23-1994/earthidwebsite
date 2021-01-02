const multer = require('multer');
const Webinar = require('../models/webinarModel');

const multerStorage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, 'public/img/webinar');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `webinar-${Date.now()}.${ext}`);
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

//   TO CREATE A webinar
exports.createWebinar = async (req, res) => {
  if (req.files && req.files.length > 0) {
    req.body.coverImage = req.files[0].filename;
  }
  try {
    const newWebinar = await Webinar.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        webinar: newWebinar,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// TO RETRIVE ALL webinar
exports.getAllWebinars = async (req, res) => {
  try {
    // TO BUILD A QUERY
    let query = Webinar.find();

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
      const numWebinars = await Webinar.countDocuments();
      if (skip >= numWebinars) throw new Error('This page does not exists!');
    }

    //  TO EXECUTE A QUERY!
    const webinars = await query;

    res.status(200).json({
      status: 'success',
      results: webinars.length,
      data: {
        webinars,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// RETRIVE A webinar
exports.getWebinar = async (req, res) => {
  try {
    // QUERY to grab the data from the database...
    const webinar = await Webinar.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        webinar,
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// TO UPDATE A webinar
exports.updateWebinar = async (req, res) => {
  console.log(req.files);
  if (req.files.length > 0) {
    req.body.coverImage = req.files[0].filename;
  }
  try {
    const updateWebinar = await Webinar.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        webinar: updateWebinar,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// TO DELETE A webinar
exports.deleteWebinar = async (req, res) => {
  try {
    await Webinar.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      //   message: `the webinar with title: ${deletewebinar.title} has been deleted successfully!`
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
