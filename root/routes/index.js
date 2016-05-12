exports.instructions = function(req, res){
  res.render('instructions', {
    title : "Instructions",
  })
};

exports.theme = function(req, res){
  res.render('theme', {
    title : "Theme",
  })
};

exports.author = function(req, res){
  res.render('author', {
    title : "Authors",
  })
};
