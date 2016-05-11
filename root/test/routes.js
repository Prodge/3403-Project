var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should();
var request = require('request');

var server = require('../app/server');
var User = require('../app/models/user');

var port = 8000;
var base_url = 'http://localhost:' + port;

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
  before(function (){
    server.listen(port);
  });

  describe('Unprotected Route', function(){

    describe('Instructions', function(){
      var route = '/instructions';

      it('Stems from the base view', function(done){
        contains_base_elements(route, done);
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
        contains_tag('table', route);
        done();
      });
      it('Should should contain a submit button', function(done){
        contains_tag('button', route);
        done();
      });
      it('contains labels', function(done){
        contains_tag('label', route);
        done();
      });
      it('contains input fields', function(done){
        request(base_url + route, function (err, res, body){
          expect(body).to.contain('<input');
        });
        done();
      });
      it('contains key login form text', function(done){
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
      it('contains labels', function(done){
        contains_tag('label', route, done);
      });
      it('contains input fields', function(done){
        request(base_url + route, function (err, res, body){
          expect(body).to.contain('<input');
          done();
        });
      });
      it('contains key register form text', function(done){
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

  describe('Protected Route', function(){
    before(function (){
      user = new User({
          name: 'Tim',
          password: 'pass'
      });
      user.save()
    });

    describe('API Authenticate', function(){
      var route = '/api/authenticate'

      it('Returns a token to a valid user', function(done){
        var options = {
          url: base_url + route,
          headers: {
            'name': 'Tim',
            'password': 'pass'
          }
        }
        request.post(options, function (err, res, body){
          expect(body.success).to.be.true;
          console.log(body)
          done();
        });
      });

    });

    after(function (){
      User.remove({})
    });

  });

  after(function (){
    server.close();
  });
});
