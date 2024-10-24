const ensureAuthorization = require('../auth');
const mariadb = require('mysql2/promise');
const {StatusCodes} = require('http-status-codes');
const jwt = require("jsonwebtoken");

const order = async (req, res)=>{

    const conn = await mariadb.createConnection({
        host : 'localhost',
        user : 'root',
        password : 'root',
        database : 'BookShop',
        dateStrings : true
    });

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
        const {items, delivery, totalQuantity, totalPrice, firstBookTitle} = req.body;

        //delivery 테이블 삽입
        let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?);`;
        let values = [delivery.address, delivery.receiver, delivery.contact]
        
        let [results] = await conn.execute(sql, values);

        let delivery_id = results.insertId;

        //orders 테이블 삽입
        sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) 
                VALUES (?, ?, ?, ?, ?);`;
        values = [firstBookTitle, totalQuantity, totalPrice, authorization.id, delivery_id];

        [results] = await conn.execute(sql, values);

        let orderId = results.insertId;

        sql = `SELECT book_id, quantity FROM cartsItems WHERE id IN (?)`
        let [orderItems, fields] = await conn.query(sql, [items]);

        //orderedBook 테이블 삽입
        sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?;`;

        values = [];
        orderItems.forEach((item) => {
            values.push([orderId, item.book_id, item.quantity])
        })

        results = await conn.query(sql, [values]);

        results = await deleteCartItems(items, conn);

        return res.status(StatusCodes.OK).json(results[0]);
    }
};

const deleteCartItems = async (items, conn) => {
    let sql = `DELETE FROM cartsItems WHERE id in (?);`;

    let result = await conn.query(sql, [items]);

    return result;
}

const getOrders = async (req, res)=>{
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
        const conn = await mariadb.createConnection({
            host : 'localhost',
            user : 'root',
            password : 'root',
            database : 'BookShop',
            dateStrings : true
        });

        let sql = `select orders.id, created_at, address, receiver, contact, book_title, total_quantity, total_price 
                    from orders left join delivery on orders.delivery_id = delivery.id WHERE user_id = ?;`;
        
        let [rows, fields] = await conn.query(sql, authorization.id);

        return res.status(StatusCodes.OK).json(rows);
    }
};

const getOrderDetail = async (req, res)=>{
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
        const orderId = req.params.id;
        const conn = await mariadb.createConnection({
            host : 'localhost',
            user : 'root',
            password : 'root',
            database : 'BookShop',
            dateStrings : true
        });

        let sql = `SELECT book_id, title, author, price, quantity
                    FROM orderedBook LEFT JOIN books
                    ON orderedBook.book_id = books.id
                    WHERE order_id = ?`;

        let [rows, fields] = await conn.query(sql,[orderId]);

        return res.status(StatusCodes.OK).json(rows);
    }
};


module.exports = {
    order, 
    getOrders,
    getOrderDetail
};