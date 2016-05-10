var express = require('express');
var router = express();
var Comment = require('../app/models/comment');

//middleware that is specific to this router
/**
router.get('/',function (req, res) {
	console.log("dfdf");
	res.render('comments');
});
**/

//on page load - load all comments
router.get('/', function getAll(req, res) {
	Comment.find(function(err, test_comments) {
		if (err) res.send(err);
		//res.render('comments', {all_comments: test_comments});
		//console.log(test_comments);
		res.json(test_comments);
	});
});

//adding a new comment
router.post('/', function(req, res) {
	Comment.create({
		name: req.body.name,
		thought: req.body.thought
	},function(err,p_comments) {
		if (err) res.send(err);
		Comment.find(function(err,all_comments){
			if (err) res.send(err);
			res.json(all_comments);
		});
	});
	//var a_comment = new Comment();
	//a_comment.name = req.body.name;
	//a_comment.thought = req.body.thought;
	//a_comment.save(function (err) {
	//	if (err) res.send(err);
	//	res.redirect('/comments');
	//});
});

router.delete('/:comment_id', function(req, res) {
	Comment.remove({
		_id: req.params.comment_id
	},function(err, test_comments){
		if (err) res.send(err);
		Comment.find(function(err,all_comments){
			if (err) res.send(err);
			res.json(all_comments);
		});
	});
});

/**
//edditing a comment
router.post('/edit/:comment_id', function(req, res) {
	Comment.findById(req.params.comment_id, function(err, test_comments) {
		if (err) res.send(err);
		//test_comments.name = req.body.name;
		test_comments.thought = req.body.thought;
		test_comments.save(function (err) {
			if (err) res.end(err);
			res.redirect('/comments');
		});
	});
});

//removing a comment
router.post('/delete/:comment_id', function(req, res) {
	console.log(req.params.comment_id);
	Comment.remove({_id: req.params.comment_id},function(err, test_comments){
		if (err) res.send(err);
		res.redirect('/comments');
	});
});
**/

module.exports = router;
