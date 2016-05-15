var server = require('./app/server');
var mongoose = require('mongoose');
var config = require('./config/database');

var port = process.env.PORT || 3000;

mongoose.connect(config.database);

server.listen(port, function(){
  console.log('Express server listening on port ' + port);
});
