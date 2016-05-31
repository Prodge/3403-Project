var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should();
var request = require('request');

var helpers = require('./helpers');
var User = require('../../app/models/user');
var config = require('../config')

var base_url = config.base_url;

module.exports = function(){
    beforeEach(function (done){
      token = null;
      current_user = new User({
        name: 'Tim',
        password: 'pass',
        email: 'tim12345@gmail.com',
        highscore: 100
      });
      current_user.save(function(){
        var options = {
          url: base_url + '/api/authenticate',
          form: {
            'name': 'Tim',
            'password': 'pass'
          }
        }
        request.post(options, function (err, res, body){
          body = JSON.parse(body);
          token = body.token;
          var cookie_jar = request.jar();
          var cookie = request.cookie('auth_token=' + token);
          cookie_jar.setCookie(cookie, base_url);
          request = request.defaults({jar: cookie_jar});
          done();
        });
      });
    });

    describe('Homepage', function(){
      var route = '/'

      it('Stems from the base view', function(done){
        helpers.contains_base_elements(route, request, done);
      });
      it('Should return ok', function(done){
        helpers.returns_ok(route, request, done);
      });
      it('Should have the title Play Action Box', function(done){
        helpers.has_title('Play Action Box', route, request, done);
      });
      it('Should should contain a canvas', function(done){
        helpers.contains_tag('canvas', route, request, done);
      });
      it('Has a form for chat', function(done){
        helpers.contains_tag('form', route, request, done);
      });
      it('Can be accessed from the root url', function(done){
        helpers.has_title('Play Action Box', '/', function(){done()});
      });
      it('Has a chat box', function(done){
        request(base_url + route, function (err, res, body){
          expect(body).to.contain('Chat Box');
          expect(body).to.contain('ng-app="gameChat"');
          expect(body).to.contain('id="chatbox"');
          done();
        });
      });
      it('Imports game.js', function(done){
        request(base_url + route, function (err, res, body){
          expect(body).to.contain('src="/js/game.js"');
          done();
        });
      });
      it('Imports the angular chat_module.js', function(done){
        request(base_url + route, function (err, res, body){
          expect(body).to.contain('src="/js/chat_module.js"');
          done();
        });
      });
      it('Requires an active user', function(done){
        request = require('request');
        request(base_url + route, function (err, res, body){
          helpers.has_title('Login', route, function(){done()});
        });
      });

    });

    describe('Play', function(){
      var route = '/play'

      it('Stems from the base view', function(done){
        helpers.contains_base_elements(route, request, done);
      });
      it('Should return ok', function(done){
        helpers.returns_ok(route, request, done);
      });
      it('Should have the title Play Action Box', function(done){
        helpers.has_title('Play Action Box', route, request, done);
      });
      it('Should should contain a canvas', function(done){
        helpers.contains_tag('canvas', route, request, done);
      });
      it('Has a form for chat', function(done){
        helpers.contains_tag('form', route, request, done);
      });
      it('Can be accessed from the root url', function(done){
        helpers.has_title('Play Action Box', '/', function(){done()});
      });
      it('Has a chat box', function(done){
        request(base_url + route, function (err, res, body){
          expect(body).to.contain('Chat Box');
          expect(body).to.contain('ng-app="gameChat"');
          expect(body).to.contain('id="chatbox"');
          done();
        });
      });
      it('Imports game.js', function(done){
        request(base_url + route, function (err, res, body){
          expect(body).to.contain('src="/js/game.js"');
          done();
        });
      });
      it('Imports the angular chat_module.js', function(done){
        request(base_url + route, function (err, res, body){
          expect(body).to.contain('src="/js/chat_module.js"');
          done();
        });
      });
      it('Requires an active user', function(done){
        request = require('request');
        request(base_url + route, function (err, res, body){
          helpers.has_title('Login', route, function(){done()});
        });
      });

    });

    describe('Comments', function(){
      var route = '/comments'

      it('Stems from the base view', function(done){
        helpers.contains_base_elements(route, request, done);
      });
      it('Should return ok', function(done){
        helpers.returns_ok(route, request, done);
      });
      it('Should have the title Comments', function(done){
        helpers.has_title('Comments', route, request, done);
      });
      it('Has a form for submitting comments', function(done){
        helpers.contains_tag('form', route, request, done);
      });
      it('Has a post button', function(done){
        request(base_url + route, function (err, res, body){
          expect(body).to.contain('Post');
          done();
        });
      });
      it('Imports the angular comments_module.js', function(done){
        request(base_url + route, function (err, res, body){
          expect(body).to.contain('src="/js/comments_module.js"');
          done();
        });
      });

    });

    describe('Leaderboard', function(){
      var route = '/leaderboard'

      it('Stems from the base view', function(done){
        helpers.contains_base_elements(route, request, done);
      });
      it('Should return ok', function(done){
        helpers.returns_ok(route, request, done);
      });
      it('Should have the title Leaderbord', function(done){
        helpers.has_title('Leaderboard', route, request, done);
      });
      it('Has a table', function(done){
        helpers.contains_tag('table', route, request, done);
      });
      it('Displays the users name', function(done){
        request(base_url + route, function (err, res, body){
          body.should.contain(current_user.name);
          done();
        });
      });
      it('Shows the users high score', function(done){
        request(base_url + route, function (err, res, body){
          body.should.contain(current_user.highscore);
          done();
        });
      });
      it('Orders users from highest to lowest score', function(done){
        other_user = new User({
          name: 'John',
          password: 'pass',
	  email: 'john12345@gmail.com',
          highscore: 200
        });
        other_user.save(function(){
          request(base_url + route, function (err, res, body){
            var other_user_pos = body.indexOf(other_user.name);
            var current_user_pos = body.indexOf(current_user.name);
            // Assert other_user with a higher score, appears earlier in the DOM
            assert.isBelow(other_user_pos, current_user_pos);
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
