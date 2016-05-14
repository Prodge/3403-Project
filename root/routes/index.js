var User           = require('../app/models/user');
var app_middleware = require('../app/middleware')
var require_login  = app_middleware.require_login
const fs           = require('fs');
const path         = require('path');

function renderGamePage(res) {
   var images = fs.readdirSync(path.join(__dirname, '../static/images/game')).map(function(image){
      return image.substring(0, image.length - 4);
   })
   res.render('game', {title : "Play Action Box",images : images})
}

module.exports = function (app){

  app.get('/', require_login, function (req, res) {
    renderGamePage(res);
  });

  app.get('/play', require_login, function (req, res) {
    renderGamePage(res);
  });

  app.get('/instructions', function(req, res){
    res.render('instructions', {
      title: "Instructions",
    })
  });

  app.get('/theme', function(req, res){
    res.render('theme', {
      title: "Theme",
    })
  });

  app.get('/author', function(req, res){
    res.render('author', {
      title: "Authors",
    })
  });

  app.get('/comments', require_login, function (req, res) {
    res.render('comments',{title: "Comments"});
  });

  app.get('/register',  function(req, res){
   context = {
      title: "Register",
    };
    res.render('register', context);
  });

  app.get('/login', function(req, res){
    res.cookie('auth_token' , 'undefined');
    context = {
      title: "Login",
      perm_denied: req.param('perm_denied', false),
    };
    res.render('login', context);
  });

  app.get('/logout', function(req, res){
    res.cookie('auth_token' , 'undefined');
    res.render('logout', {
      title: 'Logout',
      user: undefined,
    });
  });

  app.get('/leaderboard', function(req, res){
    User.find().sort({ highscore: 'descending' }).exec(function(err, users) {
      context = {
        title: "Leaderboard",
        users: users.slice(0,10),
      }
      res.render('leaderboard', context);
    })
  });

  app.get('/testing', function(req, res){
  User.find().sort({ highscore: 'descending' }).exec(function(err, users) {
    context = {
      title: "Testing",
      users: users.slice(0,10),
    }
    res.render('testing', context);
  });

  app.get('/architecture', function(req, res){
  User.find().sort({ highscore: 'descending' }).exec(function(err, users) {
    context = {
      title: "Architecture",
      users: users.slice(0,10),
    }
    res.render('architecture', context);
  });

}
