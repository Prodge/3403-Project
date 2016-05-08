var jwt         = require('jwt-simple');
var User        = require('../app/models/user');
var config      = require('../config/database'); // get db config file

exports.signup = function(req, res){
    if (!req.body.name || !req.body.password) {
        res.json({success: false, msg: 'Please pass name and password.'});
    } else {
        var newUser = new User({
            name: req.body.name,
            password: req.body.password
        });
        newUser.save(function(err) {
            if (err) {
                return res.json({success: false, msg: 'Username already exists.'});
            }
            res.json({success: true, msg: 'Successful created new user.'});
        });
    }
};

exports.authenticate = function(req, res){
    // Return the user an authentication token for thier session
    User.findOne({
        name: req.body.name
    }, function(err, user) {
        if (err) throw err;
        if (!user) {
            res.send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    var token = jwt.encode(user, config.secret);
                    res.json({success: true, token: 'JWT ' + token});
                } else {
                    res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
};

exports.login = function(req, res){
    res.cookie('auth_token' , 'undefined');
    context = {
        title: "Login",
        perm_denied: req.param('perm_denied', false),
    };
    res.render('login', context);
};

exports.logout = function(req, res){
    res.cookie('auth_token' , 'undefined');
    res.render('logout', {
        title: 'Logout',
        user: undefined,
    });
};

