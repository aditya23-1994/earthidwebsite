const jwt = require('jsonwebtoken');
const util = require('util');
const User = require('../models/userModel');

const signToken = (id) => {
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN, 
  });
};

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create(req.body);

    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        status: 'fail',
        message: 'provid a valid email and password',
      });
      return next();
    }
    // Check for user
    const user = await User.findOne({ email }).select('+password');
    const correct = await user.correctPassword(password, user.password);

    if (!user || !correct) {
      res.status(401).json({
        status: 'fail',
        message: 'incorrect password',
      });
      return next();
    }

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({
      status: 'fail',
      message: 'You are not loggedIn! Please login.'
    });
    return next();
  }

  const decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    res.status(401).json({
      status: 'fail',
      message: 'The user belonging to this token does not exists!'
    });
  }

  req.user = freshUser;

  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log(req.user);
    //  roles ['admin', 'writer'].... default role ['user']
    console.log(roles.includes());
    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        status: 'fail',
        message: 'No permission to perform this action'  
      });
      return next();
    }

    next();
  };
};
