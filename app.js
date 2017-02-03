const bodyParser = require('body-parser');
const compression = require('compression')
const config = require('config');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const passport = require('passport');
const path = require('path');

const services = require('./services');
const models = require('./models');
const authentication = require('./routes/authentication');
const index = require('./routes/index');
const processing = require('./routes/processing');
const users = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.locals.config = config;
// Initialize services.
models(app);
services(app);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(compression())
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/users', users);
app.use('/auth', authentication);
app.use('/process', processing);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
