var express = require('express')
  , session = require('express-session')
  , MongoStore = require('connect-mongo')(session)
  , path = require('path')
  , db = require('./db')
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , passport = require('passport')
;
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json({
  limit: '20mb',
}));
app.use(bodyParser.raw({
  limit: '20mb',
}));
app.use(bodyParser.text({
  limit: '20mb',
}));
app.use(bodyParser.urlencoded({
  extended: false,
  limit: '20mb',
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

db.connect('mongodb://localhost:27017/menbas', function(err, _db) {
  var routes = require('./routes/index');

  app.use(session({
    key: 'session',
    secret: 'mynewrandsecretfoobar',
    store: new MongoStore({db: _db}),
    resave: false,
    saveUninitialized: false,
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use('/', routes);

  app.all('/app/*', function(req, res) {
    res.status(200).set({
      'content-type': 'text/html; charset=utf-8'
    }).sendFile(path.join(__dirname, 'public/index.html'));
  });

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

});

module.exports = app;
