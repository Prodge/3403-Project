var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
	name : String,
	thought: String,
	created_at: Date,
	updated_at: Date
});

commentSchema.pre('save', function(next) {
	var currentDate = new Date();
	this.updated_at = currentDate;
	if (!this.created_at) this.created_at = currentDate;
	next();
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
