var jwt         = require('jwt-simple');
var User        = require('../app/models/user');
var config      = require('../config/database'); // get db config file

function get_token(headers) {
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

function get_user(token, callback){
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function(err, user) {
      if (err) throw err;
      if (user){
        callback(user);
      } else {
        callback(false);
      }
    });
  } else {
    callback(false);
  }
}

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

exports.register = function(req, res){
  context = {
    title: "Register",
  };
  res.render('register', context);
};

exports.set_high_score = function(req, res) {
  var token = get_token(req.headers);
  var highscore = req.body.highscore;
  if(!highscore){
    res.send({success: false, msg: 'Please pass highscore.'});
  }
  get_user(token, function(user){
    if(!user){
      res.send({success: false, msg: 'Invalid token.'});
    }
    user.highscore = highscore;
    user.save(function(){
      res.send({success: true, msg: 'Saved high score.'});
    });
  });
};

exports.get_high_score = function(req, res) {
  var token = get_token(req.headers);
  get_user(token, function(user){
    if(!user){
      res.send({success: false, msg: 'Invalid token.'});
    }
    res.send({success: true, highscore: user.highscore});
  });
};
