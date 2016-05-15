var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should();
var mongoose = require('mongoose');
var config = require('../config')

var Chat = require('../../app/models/chat');

describe('Chat', function(){

  beforeEach(function (done){
    mongoose.connect(config.database);
    var names = ["Wimo", "Randu", "Tim"];
    var thoughts = ["my first", "my first second", "my third first second"];
    var chats_left = names.length;
    for (var i=0; i<names.length; i++){
      Chat.create({
        name: names[i],
        thought: thoughts[i]
      }, function(err){
        if (err) throw err;
        chats_left--;
        if (chats_left === 0) done();
      });
    }
  });

  it('Can get all chats from database', function (done){
    Chat.find(function(err, chats){
      chats.length.should.equal(3);
      done();
    });
  });

  it('Each chat has a created_by date', function (done){
    Chat.find(function(err, chats){
      expect(chats[0].created_at).to.be.a('date');
      expect(chats[1].created_at).to.be.a('date');
      expect(chats[2].created_at).to.be.a('date');
      done();
    });
  });

  afterEach(function (done){
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
