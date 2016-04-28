
/*
 * GET home page.
 */

exports.index = function(req, res){
  //res.render('index', { title: 'Express' });
  res.render('index', {
    title : "testing title",
    todos : [
      { description: 'new todo'},
      { description: 'other new todo'},
    ]
  })
};
