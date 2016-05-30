var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should();
var request = require('request');

var User = require('../../app/models/user');
var Chat = require('../../app/models/chat');
var Comment = require('../../app/models/comment');
var config = require('../config')

var base_url = config.base_url;

module.exports = function(){
  beforeEach(function (done){
    current_user = new User({
      name: 'Tim',
      password: 'pass',
      email: 'tim1234@gmail.com',
      highscore: 100
    });
    current_user.save(function(){
      current_chat = new Chat({
        name: 'Tim',
        thought: 'Hello'
      });
      current_chat.save(function(){
        current_comment = new Comment({
          name: 'Wimo',
          thought: 'Hey Bud'
        });
        current_comment.save(function(){
          var options = {
            url: base_url + '/api/authenticate',
            form: {
              'name': current_user.name,
              'password': 'pass'
            }
          }
          request.post(options, function (err, res, body){
            body = JSON.parse(body);
            auth_token = body.token;
            done();
          });
        });
      });
    });
  });

  describe('Authenticate', function(){
    var route = '/api/authenticate'

    it('Returns a token to a valid user', function(done){
      var options = {
        url: base_url + route,
        form: {
          'name': 'Tim',
          'password': 'pass',
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
          'password': 'pass',
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
          'password': 'not-the-right-password',
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
          'password': 'pass_thing',
	  'email': 'tim124@gmail.com'
        }
      }
      request.post(options, function (err, res, body){
        body = JSON.parse(body);
        body.success.should.be.false;
        body.msg.should.equal('Username/Email already exists')
        done();
      });
    });
    it('Requires a username and password', function(done){
      var options = {
        url: base_url + route,
        form: {
          'name': 'Tim',
	  'email': 'tim124@gmail.com'
        }
      }
      request.post(options, function (err, res, body){
        body = JSON.parse(body);
        body.success.should.be.false;
        body.msg.should.equal('Please enter the required fields')
        done();
      });
    });
    it('Creates a user', function(done){
      var options = {
        url: base_url + route,
        form: {
          'name': 'John',
          'password': 'pass',
	  'email': 'john124@gmail.com'
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

  describe('Set High Score', function(){
    var route = '/api/set-high-score'

    it('Updates a given users high score', function(done){
      var options = {
        url: base_url + route,
        headers: {'Authorization': auth_token},
        form: {
          'highscore': 200
        }
      }
      request.post(options, function (err, res, body){
        body = JSON.parse(body);
        body.success.should.be.true;
        body.msg.should.equal('Saved high score.');
        var options = {
          url: base_url + '/api/get-high-score',
          headers: {'Authorization': auth_token},
        }
        request(options, function (err, res, body){
          body = JSON.parse(body);
          body.success.should.be.true;
          body.highscore.should.equal(200);
          done();
        });
      });
    });
    it('Requires a high score param', function(done){
      var options = {
        url: base_url + route,
        headers: {'Authorization': auth_token},
        form: {
          'not-a-highscore': 200
        }
      }
      request.post(options, function (err, res, body){
        body = JSON.parse(body);
        body.success.should.be.false;
        body.msg.should.equal('Please pass highscore.');
        done();
      });
    });
    it('Requires a valid user auth token', function(done){
      var options = {
        url: base_url + route,
        headers: {'Authorization': auth_token + 'test'},
        form: {
          'highscore': 200
        }
      }
      request.post(options, function (err, res, body){
        body.should.equal('Unauthorized');
        done();
      });
    });

  });

  describe('Get High Score', function(){
    var route = '/api/get-high-score'

    it('Returns the current users highscore', function(done){
      var options = {
        url: base_url + '/api/get-high-score',
        headers: {'Authorization': auth_token},
      }
      request(options, function (err, res, body){
        body = JSON.parse(body);
        body.success.should.be.true;
        body.highscore.should.equal(100);
        done();
      });
    });
    it('Requires a valid user auth token', function(done){
      var options = {
        url: base_url + route,
        headers: {'Authorization': auth_token + 'test'},
      }
      request(options, function (err, res, body){
        body.should.equal('Unauthorized');
        done();
      });
    });

  });

  describe('API Chats', function(){

    it('Returns last chats', function(done){
      var options = {
        url: base_url + '/api/chat-get',
        headers: {'Authorization': auth_token},
      }
      request(options, function (err, res, body){
        body = JSON.parse(body);
        body.length.should.equal(1);
        done();
      });
    });
    it('Requires a valid user auth token', function(done){
      var options = {
        url: base_url + '/api/chat-get',
        headers: {'Authorization': auth_token + 'test'},
      }
      request(options, function (err, res, body){
        body.should.equal('Unauthorized');
        done();
      });
    });
    it('Requires a valid user auth token', function(done){
      var options = {
        url: base_url + '/api/chat-getlatest',
        headers: {'Authorization': auth_token + 'test'},
      }
      request(options, function (err, res, body){
        body.should.equal('Unauthorized');
        done();
      });
    });
    it('Create a new chat thought and returns the latest', function(done){
      var options = {
        url: base_url + '/api/chat-create',
        headers: {'Authorization': auth_token},
        form: {
          'thought': 'Hello'
        }
      }
      request.post(options, function (err, res, body){
        body = JSON.parse(body);
        body.length.should.equal(1);
        expect(body[0].name).to.equal('Tim');
        expect(body[0].thought).to.equal('Hello');
        var options = {
          url: base_url + '/api/chat-getlatest',
          headers: {'Authorization': auth_token},
        }
        request(options, function (err, res, body){
          body = JSON.parse(body);
          body.length.should.equal(1);
          expect(body[0].name).to.equal('Tim');
          expect(body[0].thought).to.equal('Hello');
          done();
        });
      });
    });
    it('Requires a valid user auth token', function(done){
      var options = {
        url: base_url + '/api/chat-create',
        headers: {'Authorization': auth_token + 'test'},
        form: {
          'thought':'Hello'
        }
      }
      request.post(options, function (err, res, body){
        body.should.equal('Unauthorized');
        done();
      });
    });
  });

  describe('API Comments', function(){

    it('Returns all comments', function(done){
      var options = {
        url: base_url + '/api/comments-get',
        headers: {'Authorization': auth_token},
      }
      request(options, function (err, res, body){
        body = JSON.parse(body);
        body.length.should.equal(1);
        done();
      });
    });
    it('Requires a valid user auth token', function(done){
      var options = {
        url: base_url + '/api/comments-get',
        headers: {'Authorization': auth_token + 'test'},
      }
      request(options, function (err, res, body){
        body.should.equal('Unauthorized');
        done();
      });
    });
    it('Create a new comment, edit and delete', function(done){
      var options = {
        url: base_url + '/api/comments-create',
        headers: {'Authorization': auth_token},
        form: {
          'thought': 'Hello World 2'
        }
      }
      request.post(options, function (err, res, body){
        body = JSON.parse(body);
        body.length.should.equal(2);
        expect(body[1].name).to.equal('Tim');
        expect(body[1].thought).to.equal('Hello World 2');
        var options = {
          url: base_url + '/api/comments-edit' + body[1]._id,
          headers: {'Authorization': auth_token},
          form: {
            'thought': 'Hello World 1'
          }
        }
        request.put(options, function (err, res, body){
          body = JSON.parse(body);
          body.length.should.equal(2);
          var options = {
            url: base_url + '/api/comments-delete' + body[1]._id,
            headers: {'Authorization': auth_token},
          }
          request.delete(options, function (err, res, body){
            body = JSON.parse(body);
            body.length.should.equal(1);
            expect(body[0].name).to.equal('Wimo');
            expect(body[0].thought).to.equal('Hey Bud');
            done();
          });
        });
      });
    });
    it('Requires a valid user auth token', function(done){
      var options = {
        url: base_url + '/api/comments-create',
        headers: {'Authorization': auth_token + 'test'},
        form: {
          'thought':'Hello'
        }
      }
      request.post(options, function (err, res, body){
        body.should.equal('Unauthorized');
        done();
      });
    });
    it('Requires a valid user auth token', function(done){
      var options = {
        url: base_url + '/api/comments-edit548498494545',
        headers: {'Authorization': auth_token + 'test'},
        form: {
          'thought':'Hello'
        }
      }
      request.put(options, function (err, res, body){
        body.should.equal('Unauthorized');
        done();
      });
    });
    it('Requires a valid user auth token', function(done){
      var options = {
        url: base_url + '/api/comments-delete14148948919',
        headers: {'Authorization': auth_token + 'test'},
      }
      request.delete(options, function (err, res, body){
        body.should.equal('Unauthorized');
        done();
      });
    });

  });

  afterEach(function (done){
    User.remove({}, function(){
      Chat.remove({}, function(){
        Comment.remove({}, function(){
          done();
        });
      });
    });
  });

}
