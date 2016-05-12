var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ncommentSchema = new Schema({
	name : String,
	thought: String,
	last_edited: Date,
	isuser: Boolean
});

ncommentSchema.pre('save', function(next) {
	this.last_edited = new Date();
	this.isuser = false;
	next();
});

var Comment = mongoose.model('Comment', ncommentSchema);

module.exports = Comment;
