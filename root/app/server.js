console.log('Starting Server Init')

var express           = require('express')
var routes            = require('../routes/index')
var user_routes       = require('../routes/user')
var http              = require('http')
var path              = require('path');
var app               = express();
var bodyParser        = require('body-parser');
var cookieParser      = require('cookie-parser');
var morgan            = require('morgan');
var passport          = require('passport');
var config            = require('../config/database');
var User              = require('./models/user');
var jwt               = require('jwt-simple');
var app_middleware    = require('./middleware')
var require_login     = app_middleware.require_login

app.set('views', __dirname + '/../views');
console.log(app.get('views'))
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

// URLs
require('../routes/game_and_chat.js')(app);
require('../routes/comments.js')(app);
app.get('/instructions', routes.instructions);
app.get('/theme', routes.theme);
app.get('/author', routes.author);
app.get('/register', user_routes.register);
app.get('/login', user_routes.login);
app.get('/logout', user_routes.logout);
app.get('/leaderboard', require_login, routes.leaderboard);

// API
app.post('/api/signup', user_routes.signup);
app.post('/api/authenticate', user_routes.authenticate);
app.post('/api/set-high-score', passport.authenticate('jwt', { session: false}), user_routes.set_high_score);
app.get('/api/get-high-score', passport.authenticate('jwt', { session: false}), user_routes.get_high_score);

var server = module.exports = http.createServer(app);
