var Comment = require('../app/models/comment');

function getComments(res) {
	Comment.find(function (err, comments) {
        	if (err) res.send(err);
        	res.json(comments);
     	});
};

module.exports = function (app) {
// application -------------------------------------------------------------
    	app.get('/comments', function (req, res) {
		// load the single view file (angular will handle the page changes on the front-end)
		res.render('comments');
    	});
// api ---------------------------------------------------------------------
    	// get all todos
	app.get('/get/comments', function (req, res) {
        	// use mongoose to get all todos in the database
        	getComments(res);
    	});

    	// create todo and send back all todos after creation
	app.post('/comments', function (req, res) {
        	Comment.create({
            		name: req.body.name,
           		thought: req.body.thought
        	}, function (err, comment) {
            		if (err) res.send(err);
            		getComments(res);
       		});

    	});

    // delete a todo
	app.delete('/comments/:comment_id', function (req, res) {
        	Comment.remove({
            		_id: req.params.comment_id
        	}, function (err, comment) {
            		if (err)
                	res.send(err);
		        getComments(res);
        	});
    	});

};
