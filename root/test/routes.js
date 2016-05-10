var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should();
var request = require('request');

var server = require('../app/server');

var port = 8000;
var base_url = 'http://localhost:' + port;

function contains_base_elements(route, done){
  request(base_url + route, function (err, res, body){
    expect(body).to.contain('<div id="nav">');
    expect(body).to.contain('<div id="content">');
    expect(body).to.contain('<div id="footer">');
    expect(body).to.contain('<head>');
    expect(body).to.contain('jquery.js');
    done();
  });
}
function returns_ok(route, done){
  request(base_url + route, function (err, res, body){
    res.statusCode.should.equal(200);
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

      it('Stems from the base view', function(done){
        contains_base_elements(route, done);
      });
      it('Should return ok', function(done){
        returns_ok(route, done);
      });
      it('Should have the title instructions', function(done){
        request(base_url + route, function (err, res, body){
          expect(body).to.contain('<title>Instructions</title>');
          done();
        });
      });
      it('Should should contain a list', function(done){
        request(base_url + route, function (err, res, body){
          expect(body).to.contain('<li>');
          expect(body).to.contain('</li>');
          done();
        });
      });

    });

    describe('Authors', function(){
      var route = '/author';

      it('Stems from the base view', function(done){
        contains_base_elements(route, done);
      });
      it('Should return ok', function(done){
        returns_ok(route, done);
      });
      it('Should have the title authors', function(done){
        request(base_url + route, function (err, res, body){
          expect(body).to.contain('<title>Authors</title>');
          done();
        });
      });
      it('Should should contain a table', function(done){
        request(base_url + route, function (err, res, body){
          expect(body).to.contain('<table>');
          expect(body).to.contain('</table>');
          done();
        });
      });
      it('Displays the author names', function(done){
        request(base_url + route, function (err, res, body){
          expect(body).to.contain('Tim Metcalf');
          expect(body).to.contain('Don Wimodya Athukorala');
          done();
        });
      });

    });

  });

  after(function (){
    server.close();
  })
});
