const { Result } = require('express-validator');
const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const addToCart = (req, res)=>{
    const {book_id, quantity, user_id} = req.body;

    let sql = `INSERT INTO cartsItems (book_id, quantity, user_id) VALUES (?, ?, ?);`;
    let values = [book_id, quantity, user_id]
    
    conn.query(sql, values, 
        (err, results)=>{
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(results);
    });
};

const getCartItems = (req, res)=>{
    let {user_id, selected_item} = req.body;

    let sql = `SELECT cartsItems.id, book_id, title, summary, quantity, price 
                FROM cartsItems LEFT JOIN books 
                ON cartsItems.book_id = books.id
                WHERE user_id = ?;`;
    
    let values = [user_id]

    if(selected_item){
        sql = `SELECT cartsItems.id, book_id, title, summary, quantity, price 
                FROM cartsItems LEFT JOIN books 
                ON cartsItems.book_id = books.id
                WHERE user_id = ? AND cartsItems.id IN (?);`;
        values = [user_id, selected_item]
    }
    
    conn.query(sql, values,
        (err, results)=>{
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(results);
    });
};

const removeCartItem = (req, res)=>{
    const {id} = req.params;

    let sql = `DELETE FROM cartsItems WHERE id = ?;`;
    
    conn.query(sql, id, 
        (err, results)=>{
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(results);
    });
};


module.exports = {
    addToCart, 
    getCartItems,
    removeCartItem
};