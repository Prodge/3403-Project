var server = require('./app/server').server;
var app = require('./app/server').app;

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
