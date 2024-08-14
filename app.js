require('dotenv').config('./.env');
const express = require('express');
const app = express();

//logger
const logger = require('morgan');
const ErrorHandler = require('./utils/ErrorHandler');
const { generatedError } = require('./Middlewares/Error');
app.use(logger('tiny'));

//body parser
app.use(express.json());
app.use(express.urlencoded({extended : false}));

//routes
app.use('/', require('./Router/IndexRouter'));


//error handlers
app.all('*',(req,res,next)=> {
    next(new ErrorHandler(`Requested URL Not Found!`, 404));
});
app.use(generatedError);

//db connection
require('./Models/Database').connectDatabase();

app.listen(process.env.PORT,console.log(`server is running on Port : ${process.env.PORT}`));
