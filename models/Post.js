const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	title: {
		type: String,
		required: true
	},
	post: {
		type: String,
		required: true
	},
	name: {
		type: String
	},
	avatar: {
		type: String
	},
	upvotes: [
		{
			user: {
				type: Schema.Types.ObjectId,
				ref: 'users'
			}
		}
	],
	downvotes: [
		{
			user: {
				type: Schema.Types.ObjectId,
				ref: 'users'
			}
		}
	],
	comments: [
		{
			user: {
				type: Schema.Types.ObjectId,
				ref: 'users'
			},
			comment: {
				type: String,
				required: true
			},
			name: {
				type: String
			},
			avatar: {
				type: String
			},
			upvotes: [
				{
					user: {
						type: Schema.Types.ObjectId,
						ref: 'users'
					}
				}
			],
			downvotes: [
				{
					user: {
						type: Schema.Types.ObjectId,
						ref: 'users'
					}
				}
			],
			date: {
				type: Date,
				default: Date.now
			}
		}
	],
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = Post = mongoose.model('post', PostSchema);
