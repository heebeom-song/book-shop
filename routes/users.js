const express = require('express');
const router = express.Router();

router.use(express.json());


//로그인
router.post('/login', (req, res)=>{
    res.json({
        message : "로그인"
    });
});

//회원가입
router.post('/join', (req, res)=>{
    res.json({
        message : "회원가입"
    });
});

router.route('/reset')
.post((req, res)=>{
    res.json({
        message : "비밀번호 초기화 요청"
    });
})
.put((req, res)=>{
    res.json({
        message : "비밀번호 초기화"
    });
});

module.exports = router;