const fs = require('fs');
const path = require('path');

exports.instructions = function(req, res){
    res.render('instructions', {
        title : "Instructions",
    })
};

exports.theme = function(req, res){
    res.render('theme', {
        title : "Theme",
    })
};

exports.game = function(req, res){
    var images = fs.readdirSync(path.join(__dirname, '../static/images/game')).map(function(image){
        return image.substring(0, image.length - 4);
    })
    res.render('game', {
        title : "Play Action Box",
        images : images,
    })
};

exports.author = function(req, res){
    res.render('author', {
        title : "Authors",
    })
};
