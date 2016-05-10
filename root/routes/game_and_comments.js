var Comment = require('../app/models/comment');
var app_middleware  = require('../app/middleware')
var require_login   = app_middleware.require_login
const fs = require('fs');
const path = require('path');

function getComments(res) {
	Comment
	  .find()
	  .sort({created_at: 'desc'})
          .limit(10)
          .exec(function (err, comments) {
        	if (err) res.send(err);
        	res.json(comments.reverse());
     	});
};

function getCommentLatest(res){
	Comment
	  .find()
	  .sort({created_at: 'desc'})
	  .limit(1)
	  .exec(function (err, comments) {
	  	if (err) res.send(err);
		res.json(comments);
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
	app.get('/comments/get', function (req, res) {
        	// use mongoose to get all todos in the database
        	getComments(res);
    	});

	app.get('/comments/getlatest', function(req,res) {
		getCommentLatest(res);
	});

    	// create todo and send back all todos after creation
	app.post('/comments/create', function (req, res) {
        	Comment.create({
            		name: res.locals.user.name,
           		thought: req.body.thought
        	}, function (err, comment) {
            		if (err) res.send(err);
            		getCommentLatest(res);
       		});

    	});

    // delete a todo
	app.delete('/comments/delete/:comment_id', function (req, res) {
        	Comment.remove({
            		_id: req.params.comment_id
        	}, function (err, comment) {
            		if (err)
                	res.send(err);
		        getComments(res);
        	});
    	});

};
