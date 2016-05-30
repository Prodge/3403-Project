var jwt      = require('jwt-simple');
var passport = require('passport');
var User     = require('../../app/models/user');
var config   = require('../../config/database');
var nodemailer = require('nodemailer');

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

module.exports = function(app){

  app.post('/api/signup', function(req, res){
    if (!req.body.name || !req.body.password || !req.body.email) {
      res.json({success: false, msg: 'Please enter the required fields'});
    } else {
      var newUser = new User({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
      });
      newUser.save(function(err) {
        if (err) {
	  if (err.hasOwnProperty['errors']){
	    err_msg = err['errors']['email']['message'];
	  }else{
	    err_msg = 'Username/Email already exists';
	  }
          return res.json({success: false, msg: err_msg});
        }
        res.json({success: true, msg: 'Successful created new user.'});
      });
    }
  });

  app.post('/api/authenticate', function(req, res){
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
  });

  app.post('/api/validate-user', passport.authenticate('jwt', { session: false}), function(req, res){
    var token = get_token(req.headers);
    if (!req.body.current_password) {
      res.send({success: false, msg: 'Please enter current password'});
    }else{
      var decoded = jwt.decode(req.headers.authorization.substring(4), config.secret);
      User.findOne({name: decoded.name}, function(err, user) {
        user.comparePassword(req.body.current_password, function (err, isMatch) {
          if (isMatch && !err) {
            res.send({success: true, msg: 'Valid user!'});
          }else{
            res.send({success: false, msg: 'Authentication failed. Wrong password'});
          }
        });
      });
    }
  });

  app.post('/api/profile-update', passport.authenticate('jwt', { session: false}), function(req, res){
    var token = get_token(req.headers);
    if (!req.body.password && !req.body.email) {
      res.send({success: false, msg: 'Please enter a field'});
    }else{
      var decoded = jwt.decode(req.headers.authorization.substring(4), config.secret);
      User.findOne({name: decoded.name}, function(err, user) {
        if (req.body.password) user.password = req.body.password;
        if (req.body.email) user.email = req.body.email;
        user.save(function(err) {
          if (err) {
            var err_msg = 'Email already exists!';
            if (err['errors'] != undefined) err_msg = err['errors']['email']['message'];
            res.send({success: false, msg: err_msg});
          }
          res.send({success: true, msg: 'User updated!'});
        });
      });
    }
  });

  app.post('/api/set-high-score', passport.authenticate('jwt', { session: false}), function(req, res){
    var token = get_token(req.headers);
    var highscore = req.body.highscore;
    if(!highscore){
      res.send({success: false, msg: 'Please pass highscore.'});
    }
    get_user(token, function(user){
      user.highscore = highscore;
      user.save(function(){
        res.send({success: true, msg: 'Saved high score.'});
      });
    });
  });

  app.get('/api/get-high-score', passport.authenticate('jwt', { session: false}), function(req,res){
    var token = get_token(req.headers);
    get_user(token, function(user){
      res.send({success: true, highscore: user.highscore});
    });
  });

  app.post('/api/check-other-high-scores', passport.authenticate('jwt', { session: false}), function(req, res){
    var token = get_token(req.headers);
    if (!token) return false;
    var decoded = jwt.decode(req.headers.authorization.substring(4), config.secret);
    var highscore = req.body.highscore;
    var transporter = nodemailer.createTransport('smtps://action.box.game%40gmail.com:ActionBox12@smtp.gmail.com');
    User.find(function (err, users) {
      if (err) res.send(err);
      for (var i=0; i<users.length; i++){
        var user = users[i];
        if (highscore > user.highscore && user.name!=decoded.name && user.highscore!=0){
          var data = {
            from: '"Action Box"<action.box.game@gmail.com>', // sender address
            to: user.email, // list of receivers
            subject: 'Your Action Box game highscore has been defeated', // Subject line
            text: user.name + ' you have been beaten by ' + decoded.name + ' with a highscore of ' + highscore
          };
	      transporter.sendMail(data, function(error, info){
            if(error){
              console.log(error);
            }else{
              console.log('Message sent: ' + info.response);
            }
	      });
        }
      }
      res.send({success: true, msg: 'Checked high score'});
    });
  });
}

