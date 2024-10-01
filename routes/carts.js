const express = require('express');
const router = express.Router();

router.use(express.json());



router.delete('/:bookId', (req, res)=>{
    res.json({
        message : "장바구니 도서 삭제"
    });
});


router.route('/')
.get((req, res)=>{
    res.json({
        message : "장바구니 조회"
    });
})
.post((req, res)=>{
    res.json({
        message : "장바구니 담기"
    });
});

// router.get('/', (req, res)=>{
//     res.json({
//         message : "장바구니 선택 항목 조회"
//     });
// });


module.exports = router;