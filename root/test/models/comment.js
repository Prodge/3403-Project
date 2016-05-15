var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should();
var mongoose = require('mongoose');
var config = require('../config')

var Comment = require('../../app/models/comment');

describe('Comment', function(){

  before(function (done){
    mongoose.connect(config.database);
    var names = ["Wimo", "Randu", "Tim"];
    var thoughts = ["my first", "my first second", "my third first second"];
    var comments_left = names.length;
    for (var i=0; i<names.length; i++){
      Comment.create({
        name: names[i],
        thought: thoughts[i]
      }, function(err){
        if (err) throw err;
        comments_left--;
        if (comments_left === 0) done();
      });
    }
  });

  it('Can get all comments from database', function (done){
    Comment.find(function(err, comments){
      comments.length.should.equal(3);
      done();
    });
  });

  it('Each comment has a last_editied date', function (done){
    Comment.find(function(err, comments){
      expect(comments[0].last_edited).to.be.a('date');
      expect(comments[1].last_edited).to.be.a('date');
      expect(comments[2].last_edited).to.be.a('date');
      done();
    });
  });

  it('Can update a comment', function (done){
    Comment.findOne({name: "Tim"}, function(err, comment) {
      comment.thought = "shakala boo";
      comment.save(function (err){
        Comment.findOne({name: "Tim"}, function(err, comment) {
          comment.thought.should.equal("shakala boo");
          done();
        });
      });
    });
  });

  it('Can delete a comment', function(done){
    Comment.findOneAndRemove({name: "Randu"}, function(err){
      Comment.find(function(err, comments){
        comments.length.should.equal(2);
        done();
      });
    });
  });

  after(function (done){
    function clearDB() {
      for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove(function() {});
      }
      return true;
    }
    if (clearDB()){
      mongoose.disconnect();
      done();
    }
  });
});
