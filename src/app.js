const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
require('dotenv').config();
const middlewares = require('./middlewares');
const api = require('./api');
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI, () => {
  console.log("Connected to Database")
});

app.get('/', (req, res) => {
  res.json({
    message: 'Social Media Post App 🌈✨🌎🦄',
  });
});

app.use('/api/v1', api);

module.exports = app;
