var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should();
var request = require('request');

var User = require('../../app/models/user');
var config = require('../config')

var base_url = config.base_url;

module.exports = function(){
  beforeEach(function (done){
    current_user = new User({
        name: 'Tim',
        password: 'pass'
    });
    current_user.save(done)
  });

  describe('Authenticate', function(){
    var route = '/api/authenticate'

    it('Returns a token to a valid user', function(done){
      var options = {
        url: base_url + route,
        form: {
          'name': 'Tim',
          'password': 'pass'
        }
      }
      request.post(options, function (err, res, body){
        body = JSON.parse(body);
        expect(body.success).to.be.true;
        expect(body.token).to.not.be.null;
        done();
      });
    });
    it('Does not return a token to a non-existant user', function(done){
      var options = {
        url: base_url + route,
        form: {
          'name': 'james',
          'password': 'pass'
        }
      }
      request.post(options, function (err, res, body){
        body = JSON.parse(body);
        body.success.should.be.false;
        body.msg.should.contain('User not found')
        expect(body.token).to.be.undefined;
        done();
      });
    });
    it('Does not return a token given a non valid password', function(done){
      var options = {
        url: base_url + route,
        form: {
          'name': 'Tim',
          'password': 'not-the-right-password'
        }
      }
      request.post(options, function (err, res, body){
        body = JSON.parse(body);
        body.success.should.be.false;
        body.msg.should.contain('Wrong password')
        expect(body.token).to.be.undefined;
        done();
      });
    });

  });

  describe('signup', function(){
    var route = '/api/signup'

    it('Enforces unique names', function(done){
      var options = {
        url: base_url + route,
        form: {
          'name': 'Tim',
          'password': 'pass_thing'
        }
      }
      request.post(options, function (err, res, body){
        body = JSON.parse(body);
        body.success.should.be.false;
        body.msg.should.equal('Username already exists.')
        done();
      });
    });
    it('Requires a username and password', function(done){
      var options = {
        url: base_url + route,
        form: {
          'name': 'Tim',
        }
      }
      request.post(options, function (err, res, body){
        body = JSON.parse(body);
        body.success.should.be.false;
        body.msg.should.equal('Please pass name and password.')
        done();
      });
    });
    it('Creates a user', function(done){
      var options = {
        url: base_url + route,
        form: {
          'name': 'John',
          'password': 'pass'
        }
      }
      request.post(options, function (err, res, body){
        body = JSON.parse(body);
        body.success.should.be.true;
        body.msg.should.equal('Successful created new user.')
        User.findOne({
          name: options.form.name
        }, function(err, user) {
          user.should.not.be.null;
          user.name.should.equal(options.form.name);
          done();
        });
      });
    });

  });

  afterEach(function (done){
    User.remove({}, function(){
      done();
    });
  });

}
