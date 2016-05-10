var Comment = require('../app/models/comment');
var app_middleware  = require('../app/middleware')
var require_login   = app_middleware.require_login
const fs = require('fs');
const path = require('path');

function getComments(res) {
	Comment.find(function (err, comments) {
        	if (err) res.send(err);
		for (var i=0;i<comments.length;i++){
			comments[i]["isuser"] = res.locals.user.name === comments[i]["name"];
		}
        	res.json(comments);
     	});
};

module.exports = function (app) {
// application -------------------------------------------------------------
    	app.get('/comments', require_login, function (req, res) {
		// load the single view file (angular will handle the page changes on the front-end)
		res.render('comments',{title: "Comments"});
    	});
// api ---------------------------------------------------------------------
    	// get all todos
	app.get('/comments/get', function (req, res) {
        	// use mongoose to get all todos in the database
        	getComments(res);
    	});

    	// create todo and send back all todos after creation
	app.post('/comments/create', function (req, res) {
        	Comment.create({
            		name: res.locals.user.name,
           		thought: req.body.thought
        	}, function (err, comment) {
            		if (err) res.send(err);
        		getComments(res);
       		});

    	});

	app.put('/comments/edit/:comment_id', function (req, res) {
		Comment.findById(req.params.comment_id, function (err, comments){
			if (err) res.send(err);
                	comments.thought = req.body["A"+req.params.comment_id];
			comments.save(function (err) {
				if (err) res.end(err);
				getComments(res);
			});
		});
    	});

	// delete a todo
	app.delete('/comments/delete/:comment_id', function (req, res) {
        	Comment.remove({_id: req.params.comment_id}, function (err, comment) {
            		if (err) res.send(err);
		        getComments(res);
        	});
    	});
};
