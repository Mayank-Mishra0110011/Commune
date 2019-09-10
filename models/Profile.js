const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	handle: {
		type: String,
		required: true,
		max: 40
	},
	location: {
		type: String
	},
	bio: {
		type: String
	},
	social: {
		twitter: {
			type: String
		},
		facebook: {
			type: String
		},
		instagram: {
			type: String
		}
	},
	upvotes: {
		posts: [],
		comments: []
	},
	downvotes: {
		posts: [],
		comments: []
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = Profile = mongoose.model('profile', profileSchema);
