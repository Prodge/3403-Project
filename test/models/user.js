var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should();
var mongoose = require('mongoose');
var config = require('./../config')

var User = require('../../app/models/user');

describe('User', function(){
  var current_user;

  beforeEach(function (done){
    mongoose.connect(config.database, function(){
      current_user = new User({
          name: 'Tim',
          password: 'pass',
          email: 'tim@gmail.com'
      });
      current_user.save(done)
    });
  });

  it('Is be retrivable from the database', function (done){
    User.findOne({
      name: current_user.name
    }, function(err, user) {
      user.name.should.equal(current_user.name);
      done();
    });
  });
  it('Does not store a plain text password', function (done){
    User.findOne({
      name: 'Tim'
    }, function(err, user) {
      user.password.should.not.equal('pass');
      done();
    });
  });
  it('Can resolve a correct password match', function(done){
    User.findOne({
      name: current_user.name
    }, function(err, user) {
      user.comparePassword('pass', function(err, match){
        match.should.be.true;
        expect(err).to.be.null;
        done();
      });
    });
  });
  it('Rejects anincorrect password match', function(done){
    User.findOne({
      name: current_user.name
    }, function(err, user) {
      user.comparePassword('notMatch', function(err, match){
        match.should.be.false;
        expect(err).to.be.null;
        done();
      });
    });
  });

  afterEach(function (done){
    User.remove({name: 'Tim'}, function(){
      mongoose.connection.close(done);
    });
  });
});
