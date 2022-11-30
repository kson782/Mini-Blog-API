const {verifyAuth} = require('../middlewares');
const express = require('express');
const router = express.Router()
const {getPosts, getPost, likePost, createPost, deletePost} = require('../controllers/postsController');

router.get('/', getPosts);
router.get('/:id', getPost);
router.put('/:id', verifyAuth, likePost);
router.delete('/:id', verifyAuth, deletePost);
router.post('/', verifyAuth, createPost);

module.exports = router