var jwt = require('jwt-simple');
var User = require('./models/user'); // get the mongoose model
var config = require('../config/database');

exports.get_user = function(req, res, next){
    console.log('in get user')
    res.locals.user = undefined;
    var cookie = req.cookies.auth_token;
    var token = undefined;
    if(cookie){
        var token_pieces = cookie.split(' ')
        if(token_pieces.length == 2){
            token = token_pieces[1];
        }
    }
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            name: decoded.name
        }, function(err, user) {
            if (err) throw err;
            if (user) {
                // Make user accessible to all views
                res.locals.user = user;
                next();
            }
        });
    }else{
        next();
    }
}

exports.require_login = function(req, res, next){
    if(res.locals.user){
        next();
    }else{
        res.redirect('/login?perm_denied=true');
    }
}
