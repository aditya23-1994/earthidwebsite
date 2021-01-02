const mongoose = require('mongoose');
const validator = require('validator');

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'A subscriber must have an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = Subscriber;
