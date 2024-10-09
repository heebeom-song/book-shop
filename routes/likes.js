const express = require('express');
const { addLike, removeLike } = require('../controller/LikeController');
const router = express.Router();

router.use(express.json());


//로그인
router.route('/:liked_book_id')
.post(addLike)
.delete(removeLike);

module.exports = router;