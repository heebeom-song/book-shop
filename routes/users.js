const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const {join, login, passwordResetRequest, passwordReset} = require('../controller/UserController');

router.use(express.json());

router.post('/login', login);
router.post('/join', join);
router.route('/reset')
.post(passwordResetRequest)
.put(passwordReset);

module.exports = router;