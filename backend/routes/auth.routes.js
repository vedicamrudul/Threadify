const express = require('express');
const { signup, login, logout, authcheck } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewear/authMiddlewear');

const router = express.Router();

router.get('/authcheck', authMiddleware, authcheck);
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;