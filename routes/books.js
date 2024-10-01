const express = require('express');
const router = express.Router();

router.use(express.json());


//로그인
router.get('/', (req, res)=>{
    res.json({
        message : "전체 도서 조회"
    });
});

//회원가입
router.get('/:bookId', (req, res)=>{
    res.json({
        message : "개별 도서 조회"
    });
});

router.get('/', (req, res)=>{
    res.json({
        message : "카테고리별 도서 조회"
    });
});

module.exports = router;