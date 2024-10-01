const express = require('express');
const router = express.Router();

router.use(express.json());


//로그인
router.route('/:bookId')
.post((req, res)=>{
    res.json({
        message : "좋아요 추가"
    });
})
.delete((req, res)=>{
    res.json({
        message : "좋아요 삭제"
    });
});

module.exports = router;