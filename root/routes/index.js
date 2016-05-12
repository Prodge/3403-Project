User = require('../app/models/user');

exports.instructions = function(req, res){
  res.render('instructions', {
    title: "Instructions",
  })
};

exports.theme = function(req, res){
  res.render('theme', {
    title: "Theme",
  })
};

exports.author = function(req, res){
  res.render('author', {
    title: "Authors",
  })
};

exports.leaderboard = function(req, res){
  User.find().sort({ highscore: 'descending' }).exec(function(err, users) {
    context = {
      title: "Leaderboard",
      users: users.slice(0,10),
    }
    res.render('leaderboard', context);
  })

}
