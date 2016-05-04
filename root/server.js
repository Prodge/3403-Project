console.log('Starting Server Init')

var express     = require('express')
var routes      = require('./routes')
var user        = require('./routes/user')
var http        = require('http')
var path        = require('path');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var morgan      = require('morgan');
var passport	= require('passport');
var config      = require('./config/database'); // get db config file
var User        = require('./app/models/user'); // get the mongoose model
var port        = process.env.PORT || 8080;
var jwt         = require('jwt-simple');


//var db = Mongoose.createConnection('localhost', 'mytestapp');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'static')));
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// URLs
app.get('/', routes.game);
app.get('/instructions', routes.instructions);
app.get('/theme', routes.theme);
app.get('/play', routes.game);
app.get('/author', routes.author);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

