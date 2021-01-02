const User = require('../models/userModel');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error
    });
  }
};


exports.getUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route has not been defined yet!'
    });
  };

exports.createUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route has not been defined yet!'
    });
  };

exports.updateUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route has not been defined yet!'
    });
  };

exports.deleteUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route has not been defined yet!'
    });
  };