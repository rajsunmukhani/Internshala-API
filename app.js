require('dotenv').config('./.env');
const express = require('express');
const app = express();

//logger
const logger = require('morgan');
const ErrorHandler = require('./utils/ErrorHandler');
const { generatedError } = require('./Middlewares/Error');
app.use(logger('tiny'));

//cookie-parser & express-session
const session = require('express-session');
const cookieparser = require('cookie-parser');

app.use(session({
    resave : true,
    saveUninitialized : true,
    secret : process.env.SESSION_SECRET
}))
app.use(cookieparser());

//express fileupload
const upload = require('express-fileupload');
app.use(upload());

//body parser
app.use(express.json());
app.use(express.urlencoded({extended : false}));

//routes
app.use('/student', require('./Router/IndexRouter'));
app.use('/resume', require('./Router/ResumeRouter'));
app.use('/employee', require('./Router/EmployerRouter'));


//error handlers
app.all('*',(req,res,next)=> {
    next(new ErrorHandler(`Requested URL Not Found!`, 404));
});
app.use(generatedError);

//db connection
require('./Models/Database').connectDatabase();

app.listen(process.env.PORT,console.log(`server is running on Port : ${process.env.PORT}`));
