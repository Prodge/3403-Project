var assert = require('chai').assert;
var expect = require('chai').expect;
var shold = require('chai').assert;
var request = require('request');

var server = require('../app/server');

var port = 8000;
var base_url = 'http://localhost:' + port;

function contains_base_elements(url, done){
  request(base_url + url, function (err, res, body){
    expect(body).to.contain('<div id="nav">');
    expect(body).to.contain('<div id="content">');
    expect(body).to.contain('<div id="footer">');
    expect(body).to.contain('<head>');
    expect(body).to.contain('jquery.js');
    done();
  });
}

describe('Express Server', function(){
  before(function (){
    server.listen(port);
  })

  describe('Routes', function(){

    describe('Instructions', function(){
      var route = '/instructions';

      it('stems from the base view', function(done){
        contains_base_elements(route, done);
      });
      it('should have the title instructions', function(done){
        request(base_url + route, function (err, res, body){
          expect(body).to.contain('<title>Instructions</title>');
          done();
        });
      });
      it('should should contain a list', function(done){
        request(base_url + route, function (err, res, body){
          expect(body).to.contain('<li>');
          expect(body).to.contain('</li>');
          done();
        });
      });

    });

  });

  after(function (){
    server.close();
  })
});
