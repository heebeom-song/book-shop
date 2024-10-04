const express = require('express');
const router = express.Router();
const {
    allBooks,
    bookDetail
} = require('../controller/BookController');

router.use(express.json());

router.get('/', allBooks);
router.get('/:bookId', bookDetail);


module.exports = router;