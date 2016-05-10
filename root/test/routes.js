var assert = require('chai').assert;
var routes = require('../routes/index')

describe('Array', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});

describe('Instructions', function(){
  it('should return the title instructions', function(){
    console.log(routes.instructions(undefined, undefined))
  });
});
