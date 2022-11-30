const {verifyAuth} = require('../middlewares');
const express = require('express');
const router = express.Router()
const {getUser, deleteAccount, changePassword} = require('../controllers/usersController');

router.get('/:id', getUser);
router.delete('/:id', verifyAuth, deleteAccount);
router.put('/:id', verifyAuth, changePassword);

module.exports = router