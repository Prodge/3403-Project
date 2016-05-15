var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should();
var request = require('request');

var helpers = require('./helpers');
var config = require('../config')

var base_url = config.base_url;

module.exports = function(){
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
      helpers.returns_ok(route, request, done);
    });
    it('Should have the title instructions', function(done){
      helpers.has_title('Instructions', route, request, done);
    });
    it('Should should contain a list', function(done){
      helpers.contains_tag('li', route, request, done);
    });

  });

  describe('Testing', function(){
    var route = '/testing';

    it('Stems from the base view', function(done){
      helpers.contains_base_elements(route, request, done);
    });
    it('Should return ok', function(done){
      helpers.returns_ok(route, request, done);
    });
    it('Should have the title Testing', function(done){
      helpers.has_title('Testing', route, request, done);
    });
    it('Should should contain paragraphs', function(done){
      helpers.contains_tag('p', route, request, done);
    });
    it('Should should contain sub headings', function(done){
      helpers.contains_tag('h4', route, request, done);
    });

  });

  describe('Architecture', function(){
    var route = '/architecture';

    it('Stems from the base view', function(done){
      helpers.contains_base_elements(route, request, done);
    });
    it('Should return ok', function(done){
      helpers.returns_ok(route, request, done);
    });
    it('Should have the title Architecture', function(done){
      helpers.has_title('Architecture', route, request, done);
    });
    it('Should should contain paragraphs', function(done){
      helpers.contains_tag('p', route, request, done);
    });
    it('Should should contain sub headings', function(done){
      helpers.contains_tag('h4', route, request, done);
    });
    it('Should should contain a table', function(done){
      helpers.contains_tag('table', route, request, done);
    });

  });

  describe('About Us', function(){
    var route = '/about-us';

    it('Stems from the base view', function(done){
      helpers.contains_base_elements(route, request, done);
    });
    it('Should return ok', function(done){
      helpers.returns_ok(route, request, done);
    });
    it('Should have the title About Us', function(done){
      helpers.has_title('About Us', route, request, done);
    });
    it('Should should contain a table', function(done){
      helpers.contains_tag('table', route, request, done);
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
      helpers.contains_base_elements(route, request, done);
    });
    it('Should return ok', function(done){
      helpers.returns_ok(route, request, done);
    });
    it('Should have the title theme', function(done){
      helpers.has_title('Theme', route, request, done);
    });
    it('Should should contain a paragraph', function(done){
      helpers.contains_tag('p', route, request, done);
    });

  });

  describe('Login', function(){
    var route = '/login';

    it('Stems from the base view', function(done){
      helpers.contains_base_elements(route, request, done);
    });
    it('Should return ok', function(done){
      helpers.returns_ok(route, request, done);
    });
    it('Should have the title login', function(done){
      helpers.has_title('Login', route, request, done);
    });
    it('Should should contain a table', function(done){
      helpers.contains_tag('table', route, request, done);
    });
    it('Should should contain a submit button', function(done){
      helpers.contains_tag('button', route, request, done);
    });
    it('Contains labels', function(done){
      helpers.contains_tag('label', route, request, done);
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
      helpers.contains_base_elements(route, request, done);
    });
    it('Should return ok', function(done){
      helpers.returns_ok(route, request, done);
    });
    it('Should have the title logout', function(done){
      helpers.has_title('Logout', route, request, done);
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
      helpers.contains_base_elements(route, request, done);
    });
    it('Should return ok', function(done){
      helpers.returns_ok(route, request, done);
    });
    it('Should have the title register', function(done){
      helpers.has_title('Register', route, request, done);
    });
    it('Should should contain a table', function(done){
      helpers.contains_tag('table', route, request, done);
    });
    it('Should should contain a submit button', function(done){
      helpers.contains_tag('button', route, request, done);
    });
    it('Contains labels', function(done){
      helpers.contains_tag('label', route, request, done);
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

}
