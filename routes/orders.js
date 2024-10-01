const express = require('express');
const router = express.Router();

router.use(express.json());


router.get('/:orderId', (req, res)=>{
    res.json({
        message : "주문 상품 상세 조회"
    });
});


router.route('/')
.get((req, res)=>{
    res.json({
        message : "주문 내역 조회"
    });
})
.post((req, res)=>{
    res.json({
        message : "주문 등록"
    });
});

module.exports = router;