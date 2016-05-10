var server = require('./app/server');

var port = process.env.PORT || 3000;

server.listen(port, function(){
  console.log('Express server listening on port ' + port);
});
