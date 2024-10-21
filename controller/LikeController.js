const ensureAuthorization = require('../auth');
const { Result } = require('express-validator');
const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const jwt = require("jsonwebtoken");


const addLike = (req, res)=>{
    const {liked_book_id} = req.params;

    let authorization = ensureAuthorization(req);

    if(authorization instanceof jwt.TokenExpiredError){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message" : "로그인 세션 만료! 재로그인 요망!"
        })
    }else if(authorization instanceof jwt.JsonWebTokenError){
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message" : "잘못된 토큰입니다."
        })
    }else{
        let sql = `INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?);`;
        let values = [authorization.id, liked_book_id]
        
        conn.query(sql, values, 
            (err, results)=>{
                if(err){
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }

                return res.status(StatusCodes.OK).json(results);
        });
    }
};

const removeLike = (req, res)=>{
    const {liked_book_id} = req.params;

    let authorization = ensureAuthorization(req);

    if(authorization instanceof jwt.TokenExpiredError){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message" : "로그인 세션 만료! 재로그인 요망!"
        })
    }else if(authorization instanceof jwt.JsonWebTokenError){
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message" : "잘못된 토큰입니다."
        })
    }else{
        let sql = `DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?;`;
        let values = [authorization.id, liked_book_id]
        
        conn.query(sql, values, 
            (err, results)=>{
                if(err){
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }

                return res.status(StatusCodes.OK).json(results);
        });
    }
};

module.exports = {
    addLike, 
    removeLike
};