console.log('Starting Server Init')

var express           = require('express')
var http              = require('http')
var path              = require('path');
var bodyParser        = require('body-parser');
var cookieParser      = require('cookie-parser');
var morgan            = require('morgan');
var passport          = require('passport');
var jwt               = require('jwt-simple');
var app_middleware    = require('./middleware')
var app               = express();

app.set('views', __dirname + '/../views');
app.set('view engine', 'jade');

app.use(passport.initialize());
require('../config/passport')(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.favicon());
app.use(express.cookieParser());
app.use(express.methodOverride());

// Static Directories
app.use(express.static(path.join(__dirname, '../static')));
app.use('/angular', express.static(path.join(__dirname, '../node_modules/angular')));
app.use('/jquery', express.static(path.join(__dirname, '../node_modules/jquery/dist')));
app.use('/angular-moment', express.static(path.join(__dirname, '../node_modules/angular-moment')));
app.use('/moment', express.static(path.join(__dirname, '../node_modules/moment')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.use(app_middleware.get_user);
app.use(app.router);

//Routes
require('../routes/index.js')(app);
require('../routes/api/chats.js')(app);
require('../routes/api/comments.js')(app );
require('../routes/api/user.js')(app );

var server = module.exports = http.createServer(app);
