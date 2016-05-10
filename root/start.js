var server = require('./app/server');

var port = server.app.get('port');

server.server.listen(port, function(){
  console.log('Express server listening on port ' + port);
});
