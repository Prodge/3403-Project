
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {
    title : "testing title",
    todos : [
      { description: 'new todo'},
      { description: 'other new todo'},
    ]
  })
};

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
