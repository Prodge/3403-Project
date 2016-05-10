var Chat = require('../app/models/chat');
var app_middleware  = require('../app/middleware')
var require_login   = app_middleware.require_login
const fs = require('fs');
const path = require('path');

function getChats(res) {
	Chat.find().sort({created_at: 'desc'}).limit(10).exec(function (err, chats) {
        	if (err) res.send(err);
        	res.json(chats.reverse());
     	});
};

function getChatLatest(res){
	Chat.find().sort({created_at: 'desc'}).limit(1).exec(function (err, chats) {
	  	if (err) res.send(err);
		res.json(chats);
	});
}

function loadPage(res) {
	var images = fs.readdirSync(path.join(__dirname, '../static/images/game')).map(function(image){
        	return image.substring(0, image.length - 4);
    	})
    	res.render('game', {
        	title : "Play Action Box",
        	images : images,
    	})
}

module.exports = function (app) {
// application -------------------------------------------------------------
    	app.get('/', require_login, function (req, res) {
		// load the single view file (angular will handle the page changes on the front-end)
		loadPage(res);
    	});
    	app.get('/play', require_login, function (req, res) {
		// load the single view file (angular will handle the page changes on the front-end)
		loadPage(res);
    	});
// api ---------------------------------------------------------------------
    	// get all todos
	app.get('/chat/get', function (req, res) {
        	// use mongoose to get all todos in the database
        	getChats(res);
    	});

	app.get('/chat/getlatest', function(req,res) {
		getChatLatest(res);
	});

    	// create todo and send back all todos after creation
	app.post('/chat/create', function (req, res) {
        	Chat.create({
            		name: res.locals.user.name,
           		thought: req.body.thought
        	}, function (err, chat) {
            		if (err) res.send(err);
            		getChatLatest(res);
       		});

    	});

};
