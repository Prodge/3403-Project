var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should();

var config = require('../config');

var base_url = config.base_url;

exports.contains_base_elements = function(route, request, done){
  request(base_url + route, function (err, res, body){
    expect(body).to.contain('<div id="nav">');
    expect(body).to.contain('<div id="content">');
    expect(body).to.contain('<div id="footer">');
    expect(body).to.contain('<head>');
    expect(body).to.contain('jquery.js');
    done();
  });
}

exports.returns_ok = function(route, request, done){
  request(base_url + route, function (err, res, body){
    res.statusCode.should.equal(200);
    done();
  });
}

exports.contains_tag = function(tag, route, request, done){
  request(base_url + route, function (err, res, body){
    expect(body).to.contain('<' + tag);
    expect(body).to.contain('</' + tag + '>');
    done();
  });
}

exports.has_title = function(title, route, request, done){
  request(base_url + route, function (err, res, body){
    expect(body).to.contain('<title>' + title + '</title>');
    done();
  });
}
