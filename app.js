const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const blogRouter = require('./routes/blogRoutes');
const userRouter = require('./routes/userRoutes');
const webinarRouter = require('./routes/webinarRoutes');

const app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success!',
    message: 'app is working start coding!',
  });
});

// ROUTES
app.use('/api/v1/blog', blogRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/webinars', webinarRouter);

module.exports = app;
