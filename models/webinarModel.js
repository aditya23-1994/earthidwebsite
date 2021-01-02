const mongoose = require('mongoose');
const slugify = require('slugify');

const webinarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A webinar must have a title'],
    unique: true,
    trim: true,
    maxlength: [470, 'A webinar title must be less than 471 characters!'],
  },
  description: {
    type: String,
    required: [true, 'A webinar must have a description'],
    trim: true,
  },
  coverImage: {
    type: String,
  },
  url: {
    type: String,
    requrired: [true, 'A webinar must have an url'],
  },
  eventDate: {
    type: Date,
    required: [true, 'An event of webinar must have a date'],
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  slug: String,
});

//  Document Middleware...
// 1) To Create a SLUG
webinarSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Webinar = mongoose.model('Webinar', webinarSchema);

module.exports = Webinar;
