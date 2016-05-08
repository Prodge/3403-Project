console.log('Starting Server Init')

var express         = require('express')
var routes          = require('./routes')
var user_routes     = require('./routes/user')
var http            = require('http')
var path            = require('path');
var app             = express();
var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');
var mongoose        = require('mongoose');
var morgan          = require('morgan');
var passport        = require('passport');
var config          = require('./config/database'); // get db config file
var User            = require('./app/models/user'); // get the mongoose model
var port            = process.env.PORT || 8080;
var jwt             = require('jwt-simple');


app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'static')));
app.use('/angular', express.static(path.join(__dirname, 'node_modules/angular')));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));

app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

require_authentication = function(req, res, next){
    var token = req.cookies.auth_token.split(' ')[1];
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            name: decoded.name
        }, function(err, user) {
            if (err) throw err;
            if (user) {
                next();
            }
        });
    }else{
        res.redirect('/login');
    }
}

// URLs
app.get('/', require_authentication, routes.game);
app.get('/instructions', routes.instructions);
app.get('/theme', routes.theme);
app.get('/play', require_authentication, routes.game);
app.get('/author', routes.author);

mongoose.connect(config.database);

require('./config/passport')(passport);

// bundle our routes
//var apiRoutes = express.Router();

app.post('/api/signup', user_routes.signup);
app.post('/api/authenticate', user_routes.authenticate);

app.get('/login', user_routes.login);


app.get('/api/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    console.log(token)
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            name: decoded.name
        }, function(err, user) {
            if (err) throw err;
            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                res.json({success: true, msg: 'Welcome in the member area ' + user.name + '!'});
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
});

getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};


// connect the api routes under /api/*
//app.use('/api', apiRoutes);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

