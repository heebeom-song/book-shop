const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.listen(process.env.PORT);

const userRouter = require("./routes/users");
const cartRouter = require("./routes/carts");
const bookRouter = require("./routes/books");
const likeRouter = require("./routes/likes");
const orderRouter = require("./routes/orders");

app.use("/users", userRouter);
app.use("/carts", cartRouter);
app.use("/books", bookRouter);
app.use("/likes", likeRouter);
app.use("/orders", orderRouter);
