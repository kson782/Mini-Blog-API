const express = require('express');
const authRoute = require('./auth');
const postsRoute = require('./posts');
const usersRoute = require('./users');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the API 🌈✨🌎🦄',
  });
});

router.use('/posts', postsRoute)
router.use('/auth', authRoute);
router.use('/users', usersRoute);

module.exports = router;
