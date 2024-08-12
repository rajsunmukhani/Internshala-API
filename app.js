require('dotenv').config('./.env');
const express = require('express');
const app = express();
const logger = require('morgan');
app.use(logger('tiny'));

app.use('/', require('./Router/IndexRouter'));

app.listen(process.env.PORT,console.log(`server is running on Port : ${process.env.PORT}`));
