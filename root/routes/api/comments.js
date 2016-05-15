var passport = require('passport');
var Comment  = require('../../app/models/comment');
var jwt    = require('jwt-simple');
var User   = require('../../app/models/user');
var config = require('../../config/database');

function getComments(res) {
  Comment.find(function (err, comments) {
    if (err) res.send(err);
    //if logged in user owns comment
    for (var i=0;i<comments.length;i++){
      comments[i]["isuser"] = res.locals.user.name === comments[i]["name"];
    }
    res.json(comments);
  });
};

module.exports = function (app) {

  app.get('/api/comments-get', passport.authenticate('jwt', {session: false}), function (req, res) {
      getComments(res);
  });

  app.post('/api/comments-create',passport.authenticate('jwt', { session: false}), function (req, res) {
    var decoded = jwt.decode(req.headers.authorization.substring(4), config.secret);
    User.findOne({name: decoded.name}, function(err, user) {
      if (err) throw err;
      Comment.create({name:user.name , thought: req.body.thought}, function (err, comment) {
         if (err) res.send(err);
         getComments(res);
      });
    });
  });

  app.put('/api/comments-edit:comment_id',passport.authenticate('jwt', { session: false}), function (req, res) {
    Comment.findById(req.params.comment_id, function (err, comments){
      if (err) res.send(err);
      comments.thought = req.body["A"+req.params.comment_id];
      comments.save(function (err) {
        if (err) res.end(err);
        getComments(res);
      });
    });
  });

  app.delete('/api/comments-delete:comment_id',passport.authenticate('jwt', { session: false}), function (req, res) {
    Comment.remove({_id: req.params.comment_id}, function (err, comment) {
      if (err) res.send(err);
      getComments(res);
    });
  });
};
