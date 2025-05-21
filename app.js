var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('./db/mongo');

require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var deviceRouter = require('./routes/device');
var oneSignalRouter = require('./routes/oneSignal');
var busRouter = require('./routes/bus');
var operatorRouter = require('./routes/operator');
var touringTalkiesPassengerDetailsRouter = require('./routes/touringTalkiesPassengerDetails');

var app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/device',deviceRouter);
app.use('/oneSignal',oneSignalRouter);
app.use('/bus',busRouter);
app.use('/operator', operatorRouter);
app.use('/touringTalkiesPassengerDetails',touringTalkiesPassengerDetailsRouter);



module.exports = app;
