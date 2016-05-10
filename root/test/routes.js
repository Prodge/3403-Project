var assert = require('chai').assert;
var expect = require('chai').expect;
var shold = require('chai').assert;
var request = require('request');

var server = require('../app/server');

var port = 8000;

describe('Array', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});

describe('Express Server', function(){
  before(function (){
    server.listen(port);
  })

  describe('Routes', function(){

    describe('Instructions', function(){
      it('should have the title instructions', function(done){
        request('http://localhost:'+port+'/instructions', function (err, res, body){
          expect(body).to.contain('<title>Instructions</title>');
          done();
        });
      });
      it('should should contain a list', function(done){
        request('http://localhost:'+port+'/instructions', function (err, res, body){
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
