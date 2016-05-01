
exports.index = function(req, res){
  //res.render('index', { title: 'Express' });
  res.render('game', {
    title : "Play Action Box",
  })
};
