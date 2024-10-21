const ensureAuthorization = require("../auth");
const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const jwt = require("jsonwebtoken");


const addToCart = (req, res)=>{
    const {book_id, quantity} = req.body;

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
        let sql = `INSERT INTO cartsItems (book_id, quantity, user_id) VALUES (?, ?, ?);`;
        let values = [book_id, quantity, authorization.id]

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

const getCartItems = (req, res)=>{
    let {selected_item} = req.body;

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
        let sql = `SELECT cartsItems.id, book_id, title, summary, quantity, price 
                FROM cartsItems LEFT JOIN books 
                ON cartsItems.book_id = books.id
                WHERE user_id = ?`;
    
        let values = [authorization.id]

        if(selected_item){
            sql +=` AND cartsItems.id IN (?);`;
            values.push(selected_item);
        }
        
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

const removeCartItem = (req, res)=>{
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
        const cartItemId = req.params.id;

        let sql = `DELETE FROM cartsItems WHERE id = ?;`;
        
        conn.query(sql, cartItemId, 
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
    addToCart, 
    getCartItems,
    removeCartItem
};