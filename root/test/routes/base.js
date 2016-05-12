var mongoose = require('mongoose');
var config = require('../config')
var server = require('../../app/server');

var unprotected_route_tests = require('./unprotected')
var api_route_tests = require('./api')
var protected_route_tests = require('./protected')


describe('Express Router', function(){
  beforeEach(function (done){
    server.listen(config.port);
    mongoose.connect(config.database, done);
  });

  describe('Unprotected Route', unprotected_route_tests);

  describe('API', api_route_tests);

  describe('Protected Routes', protected_route_tests);

  afterEach(function (done){
    server.close();
    mongoose.connection.close(done);
  });

});
