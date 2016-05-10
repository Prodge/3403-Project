var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chatSchema = new Schema({
	name : String,
	thought: String,
	created_at: Date
});

chatSchema.pre('save', function(next) {
	this.created_at = new Date();
	next();
});

var Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
