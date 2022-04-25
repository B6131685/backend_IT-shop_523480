const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const passport = require('passport')

//import middleware
const errorHandler = require('./middleware/errorHandler');

//connect mongoose
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const specsRouter = require('./routes/specs');
const verifyRouter = require('./routes/verify');
const productRouter = require('./routes/product')

const app = express();

//connect mongoose
mongoose.connect('mongodb://localhost:27017/ITShop');

app.use(logger('dev'));
app.use(express.json(
    {
        limit:'100mb'
    }
));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','http://localhost:4200')
    res.setHeader('Access-Control-Allow-Methods','POST,GET,PUT,PATCH,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Option,Authorization')
    return next()
})


//init passport
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/specs', specsRouter);
app.use('/verify', verifyRouter);
app.use('/product', productRouter);

app.use(errorHandler);

module.exports = app;
