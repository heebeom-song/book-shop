const { Result } = require('express-validator');
const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const jwt = require("jsonwebtoken");
const ensureAuthorization = require('../auth');

const allBooks = (req, res)=>{
    let allBooksRes = {};
    let {category_id, news, limit, currentPage} = req.query;

    let offset = limit * (currentPage-1);
    let sql = "SELECT sql_calc_found_rows *, (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes FROM books";
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
            }
            if(results.length){
                results.map(function(result){
                    result.pubDate = result.pub_date;
                    delete result.pub_date;
                });
                allBooksRes.books = results;
            }else{
                return res.status(StatusCodes.NOT_FOUND).end();
            }
    });

    sql = "SELECT found_rows();";
    conn.query(sql, 
        (err, results)=>{
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            let pagination = {};
            pagination.currentPage = parseInt(currentPage);
            pagination.totalCount =  results[0]["found_rows()"];

            allBooksRes.pagination = pagination;

            return res.status(StatusCodes.OK).json(allBooksRes);
        
    });
};

const bookDetail = (req, res)=>{

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
        let {bookId} = req.params;
        let sql;
        let values;

        if(authorization instanceof ReferenceError){
            sql = `SELECT *,
                    (select count(*) from likes where liked_book_id = books.id) AS likes 
                    FROM books LEFT JOIN category 
                    ON books.category_id = category.category_id WHERE books.id = ?;`;
        
            values = [bookId]
        }else{
            sql = `SELECT *, 
                (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?)) AS liked,
                (select count(*) from likes where liked_book_id = books.id) AS likes 
                FROM books LEFT JOIN category 
                ON books.category_id = category.category_id WHERE books.id = ?;`;
        
            values = [authorization.id, bookId, bookId]
        }

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
    }
};

module.exports = {
    allBooks, 
    bookDetail
};