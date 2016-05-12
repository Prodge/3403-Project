var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should();
var request = require('request');
var mongoose = require('mongoose');
var config = require('./config')

var server = require('../app/server');
var User = require('../app/models/user');

var base_url = config.base_url;

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

function contains_tag(tag, route, done){
  request(base_url + route, function (err, res, body){
    expect(body).to.contain('<' + tag);
    expect(body).to.contain('</' + tag + '>');
    done();
  });
}

function has_title(title, route, done){
  request(base_url + route, function (err, res, body){
    expect(body).to.contain('<title>' + title + '</title>');
    done();
  });
}

describe('Express Server', function(){
  beforeEach(function (done){
    server.listen(config.port);
    mongoose.connect(config.database, done);
  });

  describe('Unprotected Route', function(){

    describe('Instructions', function(){
      var route = '/instructions';

      it('Stems from the base view', function(done){
        request(base_url + route, function (err, res, body){
          expect(body).to.contain('<div id="nav">');
          expect(body).to.contain('<div id="content">');
          expect(body).to.contain('<div id="footer">');
          expect(body).to.contain('<head>');
          expect(body).to.contain('jquery.js');
          done();
        });
      });
      it('Should return ok', function(done){
        returns_ok(route, done);
      });
      it('Should have the title instructions', function(done){
        has_title('Instructions', route, done);
      });
      it('Should should contain a list', function(done){
        contains_tag('li', route, done);
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
        has_title('Authors', route, done);
      });
      it('Should should contain a table', function(done){
        contains_tag('table', route, done);
      });
      it('Displays the author names', function(done){
        request(base_url + route, function (err, res, body){
          expect(body).to.contain('Tim Metcalf');
          expect(body).to.contain('Don Wimodya Athukorala');
          done();
        });
      });

    });

    describe('Theme', function(){
      var route = '/theme';

      it('Stems from the base view', function(done){
        contains_base_elements(route, done);
      });
      it('Should return ok', function(done){
        returns_ok(route, done);
      });
      it('Should have the title theme', function(done){
        has_title('Theme', route, done);
      });
      it('Should should contain a paragraph', function(done){
        contains_tag('p', route, done);
      });

    });

    describe('Login', function(){
      var route = '/login';

      it('Stems from the base view', function(done){
        contains_base_elements(route, done);
      });
      it('Should return ok', function(done){
        returns_ok(route, done);
      });
      it('Should have the title login', function(done){
        has_title('Login', route, done);
      });
      it('Should should contain a table', function(done){
        contains_tag('table', route, done);
      });
      it('Should should contain a submit button', function(done){
        contains_tag('button', route, done);
      });
      it('Contains labels', function(done){
        contains_tag('label', route, done);
      });
      it('Contains input fields', function(done){
        request(base_url + route, function (err, res, body){
          expect(body).to.contain('<input');
          done();
        });
      });
      it('Contains key login form text', function(done){
        request(base_url + route, function (err, res, body){
          expect(body).to.contain('Login');
          expect(body).to.contain('Register');
          expect(body).to.contain('Username');
          expect(body).to.contain('Password');
          done();
        });
      });
      it('should have a password field', function(done){
        request(base_url + route, function (err, res, body){
          expect(body).to.contain('type="password"');
          done();
        });
      });

    });

    describe('Logout', function(){
      var route = '/logout';

      it('Stems from the base view', function(done){
        contains_base_elements(route, done);
      });
      it('Should return ok', function(done){
        returns_ok(route, done);
      });
      it('Should have the title logout', function(done){
        has_title('Logout', route, done);
      });
      it('Contains a successful logout message', function(done){
        request(base_url + route, function (err, res, body){
          expect(body).to.contain('successfully logged out');
          done();
        });
      });

    });

    describe('Register', function(){
      var route = '/register';

      it('Stems from the base view', function(done){
        contains_base_elements(route, done);
      });
      it('Should return ok', function(done){
        returns_ok(route, done);
      });
      it('Should have the title register', function(done){
        has_title('Register', route, done);
      });
      it('Should should contain a table', function(done){
        contains_tag('table', route, done);
      });
      it('Should should contain a submit button', function(done){
        contains_tag('button', route, done);
      });
      it('Contains labels', function(done){
        contains_tag('label', route, done);
      });
      it('Contains input fields', function(done){
        request(base_url + route, function (err, res, body){
          expect(body).to.contain('<input');
          done();
        });
      });
      it('Contains key register form text', function(done){
        request(base_url + route, function (err, res, body){
          expect(body).to.contain('Register');
          expect(body).to.contain('Username');
          expect(body).to.contain('Password');
          done();
        });
      });
      it('should have a password field', function(done){
        request(base_url + route, function (err, res, body){
          expect(body).to.contain('type="password"');
          done();
        });
      });

    });

  });

  describe('API', function(){
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

  });

  describe('Protected Routes', function(){
    beforeEach(function (done){
      token = null;
      current_user = new User({
          name: 'Tim',
          password: 'pass'
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

    describe('Play', function(){
      var route = '/play'

      it('Stems from the base view', function(done){
        contains_base_elements(route, done);
      });
      it('Should return ok', function(done){
        returns_ok(route, done);
      });
      it('Should have the title Play Action Box', function(done){
        has_title('Play Action Box', route, done);
      });
      it('Should should contain a canvas', function(done){
        contains_tag('canvas', route, done);
      });
      it('Has a form for chat', function(done){
        contains_tag('form', route, done);
      });
      it('Can be accessed from the root url', function(done){
        has_title('Play Action Box', '/', done);
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

    });

    afterEach(function (done){
      User.remove({}, function(){
        done();
      });
    });

  });

  afterEach(function (done){
    server.close();
    mongoose.connection.close(done);
  });

});
