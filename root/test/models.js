var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should();

var User = require('../app/models/user');

describe('User', function(){
  before(function (){
    user = new User({
        name: 'Tim',
        password: 'pass'
    });
    user.save()
  });

  it('Is be retrivable from the database', function (done){
    User.findOne({
      name: user.name
    }, function(err, this_user) {
      this_user.should.equal(user);
    });
    done();
  });
  it('Does not store a plain text password', function (){
    User.findOne({
      name: user.name
    }, function(err, this_user) {
      this_user.password.should.not.equal('pass');
    });
  });
  it('Can resolve a correct password match', function(){
    User.findOne({
      name: user.name
    }, function(err, this_user) {
      expect(this_user.comparePassword(user.password)).to.be.true;
    });
  });
  it('Rejects an incorrect password match', function(){
    User.findOne({
      name: user.name
    }, function(err, this_user) {
      expect(this_user.comparePassword('noMatch')).to.be.false;
    });
  });

  after(function (){
    User.remove({})
  });
});
