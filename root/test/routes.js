var assert = require('chai').assert;
var routes = require('../routes/index');
var server = require('../app/server').server;
var request = require('request')

describe('Array', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});

describe('server response', function(){
  before(function (){
    server.listen(8000);
    console.log(server)
  })
  it('should return the title instructions', function(){
    console.log('about to test the request')
    request(server).get('http://127.0.0.1:8000/instructions', function (err, res, body){
      console.log('test the request')
      console.log(err)
      console.log(res)
      console.log(body)
      //console.log(routes.instructions(undefined, undefined))
    });
  });
  after(function (){
    server.close();
  })
});
