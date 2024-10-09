const { Result } = require('express-validator');
const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const allBooks = (req, res)=>{
    let {category_id, news, limit, currentPage} = req.query;

    let offset = limit * (currentPage-1);
    let sql = "SELECT *, (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes FROM books";
    let values = [];

    if(category_id && news){
        sql += " WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(now(), INTERVAL 1 MONTH) AND now()";
        values.push(category_id);
    }
    else if(category_id){
        sql += " WHERE category_id = ?";
        values.push(category_id);
    }
    else if(news){
        sql += " WHERE pub_date BETWEEN DATE_SUB(now(), INTERVAL 1 MONTH) AND now()"
    }

    sql += " LIMIT ? OFFSET ?";
    values.push(parseInt(limit), offset);

    conn.query(sql, values, 
        (err, results)=>{
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if(results.length){
                return res.status(StatusCodes.OK).json(results);
            }else{
                return res.status(StatusCodes.NOT_FOUND).end();
            }
    });
};

const bookDetail = (req, res)=>{
    let {bookId} = req.params;
    let {user_id} = req.body;

    let sql = `SELECT *, 
                (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?)) AS liked,
                (select count(*) from likes where liked_book_id = books.id) AS likes 
                FROM books LEFT JOIN category 
                ON books.category_id = category.category_id WHERE books.id = ?;`;
    
    let values = [user_id, bookId, bookId]
    conn.query(sql, values, 
        (err, results)=>{
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if(results[0]){
                return res.status(StatusCodes.OK).json(results[0]);
            }else{
                return res.status(StatusCodes.NOT_FOUND).end();
            }
    });
};

module.exports = {
    allBooks, 
    bookDetail
};