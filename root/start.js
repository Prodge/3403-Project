var server = require('./app/server');

server.server.listen(server.app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
