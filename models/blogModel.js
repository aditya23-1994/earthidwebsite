const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A blog must have a title'],
    unique: true,
    trim: true,
    maxlength: [170, 'A blog title must be less than 171 characters!'],
  },
  subject: {
    type: String,
    required: [true, 'A blog must have a subject'],
    trim: true,
  },
  article: {
    type: String,
    required: [true, 'A blog must have an article'],
    trim: true,
  },
  coverImage: {
    type: String,
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  slug: String,
});

//  Document Middleware...
// 1) To Create a SLUG
blogSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
