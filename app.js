const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');
const cors = require('cors');
const adminRouter = require('./routes/admin');
const controllerRouter = require('./routes/controller');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Use CORS
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', adminRouter, controllerRouter);

// GET root endpoint
app.get('/', (req, res, next) => {
    res.status(200).json({
        success: true,
        status: 200,
        message: 'Api is up',
    });
});
// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use(errorHandler);

module.exports = app;
