var passport = require('passport');
var Chat     = require('../../app/models/chat');
var jwt    = require('jwt-simple');
var User   = require('../../app/models/user');
var config = require('../../config/database');

function getChats(res) {
   Chat.find().sort({created_at: 'desc'}).limit(10).exec(function (err, chats) {
      if (err) res.send(err);
      res.json(chats.reverse());
   });
};

function getChatLatest(res){
   Chat.find().sort({created_at: 'desc'}).limit(1).exec(function (err, chats) {
      if (err) res.send(err);
      res.json(chats);
   });
}

module.exports = function (app) {

   app.get('/api/chat-get',passport.authenticate('jwt', {session: false}), function (req, res) {
      getChats(res);
   });

   app.get('/api/chat-getlatest',passport.authenticate('jwt', {session: false}), function(req,res) {
      getChatLatest(res);
   });

   app.post('/api/chat-create',passport.authenticate('jwt', {session: false}), function (req, res) {
      var decoded = jwt.decode(req.headers.authorization.substring(4), config.secret);
      User.findOne({name: decoded.name}, function(err, user) {
        if (err) throw err;
        Chat.create({name:user.name , thought: req.body.thought}, function (err, chat) {
           if (err) res.send(err);
           getChatLatest(res);
        });
      });
   });
};
