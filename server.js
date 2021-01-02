const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env'});
//  SET UP FOR MONGOOSE AND CONNECT TO DB

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(() => {
  console.log('DB connection successful!');
});

const app = require('./app');
//  SERVER CONNECTION
const port = 3001;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
