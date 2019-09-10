const express = require('express');
const router = express.Router();
const post = require('../../models/Post');
const profile = require('../../models/Profile');
const { validatePostInput, validatePostComment } = require('../../validation/post');
const passport = require('passport');

//@route GET api/posts/test
//@desc Test post route
//@access Public
router.get('/test', (req, res) => {
	res.json({ msg: 'Post Works' });
});

//@route GET api/posts
//@desc Get posts
//@access Public
router.get('/', (req, res) => {
	post
		.find()
		.sort({ date: -1 })
		.then((posts) => {
			res.json(posts);
		})
		.catch(() => {
			res.status(404).json({ noPostFound: 'No Posts Found' });
		});
});

//@route GET api/posts/comment/:id/:comment_id
//@desc Get comment by id
//@access Public
router.get('/comment/:id/:comment_id', (req, res) => {
	post
		.findById(req.params.id)
		.then((post) => {
			if (post.comments.filter((comment) => comment._id.toString() === req.params.comment_id).length === 0) {
				return res.status(404).json({ commentNotExist: 'Comment does not exist' });
			}
			const index = post.comments
				.map((item) => {
					return item._id.toString();
				})
				.indexOf(req.params.comment_id);
			res.json({ comment: post.comments[index] });
		})
		.catch(() => {
			res.status(404).json({ noPostFound: 'No Post Found with that id' });
		});
});

//@route GET api/posts/:id
//@desc Get post by id
//@access Public
router.get('/:id', (req, res) => {
	post
		.findById(req.params.id)
		.then((post) => {
			res.json(post);
		})
		.catch(() => {
			res.status(404).json({ noPostFound: 'No Post Found with that id' });
		});
});

//@route POST api/posts
//@desc Create post
//@access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validatePostInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}
	const newPost = new Post({
		title: req.body.title,
		post: req.body.post,
		name: req.body.name,
		avatar: req.body.avatar,
		user: req.user.id
	});
	newPost.save().then((post) => {
		res.json(post);
	});
});

//@route DELETE api/posts/:id
//@desc Delete post by id
//@access Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	profile.findOne({ user: req.user.id }).then(() => {
		post
			.findById(req.params.id)
			.then((post) => {
				if (post.user.toString() !== req.user.id) {
					return res.status(401).json({ unauthorized: 'User Not Authorized' });
				}
				post.title = 'Deleted';
				post.post = 'Deleted';
				post.save().then((post) => res.json(post));
			})
			.catch(() => {
				res.status(404).json({ noPostFound: 'No Post Found with that id' });
			});
	});
});

//@route POST api/posts/upvote/:id
//@desc Upvote post
//@access Private
router.post('/upvote/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	profile
		.findOne({ user: req.user.id })
		.then((userProfile) => {
			if (userProfile) {
				post
					.findById(req.params.id)
					.then((post) => {
						if (post.upvotes.filter((upvote) => upvote.user.toString() === req.user.id).length > 0) {
							//Remove upvote from post if user has already upvoted the post
							const removeIndex = post.upvotes
								.map((item) => {
									item.user.toString();
								})
								.indexOf(req.user.id);
							const userProfileRemoveIndex = userProfile.upvotes.posts
								.map((item) => {
									return item.toString();
								})
								.indexOf(req.params.id);
							userProfile.upvotes.posts.splice(userProfileRemoveIndex, 1);
							userProfile.save().then(() => {
								post.upvotes.splice(removeIndex, 1);
								post.save().then((post) => res.json(post));
							});
						} else if (
							post.downvotes.filter((downvote) => downvote.user.toString() === req.user.id).length > 0
						) {
							//Remove downvote if trying to upvote and add upvote
							const removeIndex = post.downvotes
								.map((item) => {
									item.user.toString();
								})
								.indexOf(req.user.id);
							const userProfileRemoveIndex = userProfile.downvotes.posts
								.map((item) => {
									return item.toString();
								})
								.indexOf(req.params.id);
							userProfile.downvotes.posts.splice(userProfileRemoveIndex, 1);
							userProfile.upvotes.posts.unshift(req.params.id);
							userProfile.save().then(() => {
								post.downvotes.splice(removeIndex, 1);
								post.upvotes.unshift({ user: req.user.id });
								post.save().then((post) => res.json(post));
							});
						} else {
							userProfile.upvotes.posts.unshift(req.params.id);
							userProfile.save().then(() => {
								post.upvotes.unshift({ user: req.user.id });
								post.save().then((post) => res.json(post));
							});
						}
					})
					.catch(() => {
						res.status(404).json({ noPostFound: 'No Post Found with that id' });
					});
			} else {
				throw err;
			}
		})
		.catch(() => {
			res.status(404).json({ profileNotFound: 'Profile Not Found' });
		});
});

//@route POST api/posts/downvote/:id
//@desc Downvote post
//@access Private
router.post('/downvote/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	profile
		.findOne({ user: req.user.id })
		.then((userProfile) => {
			if (userProfile) {
				post
					.findById(req.params.id)
					.then((post) => {
						if (post.downvotes.filter((downvote) => downvote.user.toString() === req.user.id).length > 0) {
							//Remove downvote from post if user has already downvoted the post
							const removeIndex = post.downvotes
								.map((item) => {
									item.user.toString();
								})
								.indexOf(req.user.id);
							const userProfileRemoveIndex = userProfile.downvotes.posts
								.map((item) => {
									return item.toString();
								})
								.indexOf(req.params.id);
							userProfile.downvotes.posts.splice(userProfileRemoveIndex, 1);
							userProfile.save().then(() => {
								post.downvotes.splice(removeIndex, 1);
								post.save().then((post) => res.json(post));
							});
						} else if (post.upvotes.filter((upvote) => upvote.user.toString() === req.user.id).length > 0) {
							//Remove upvote if trying to downvote and add downvote
							const removeIndex = post.upvotes
								.map((item) => {
									item.user.toString();
								})
								.indexOf(req.user.id);
							const userProfileRemoveIndex = userProfile.upvotes.posts
								.map((item) => {
									return item.toString();
								})
								.indexOf(req.params.id);
							userProfile.upvotes.posts.splice(userProfileRemoveIndex, 1);
							userProfile.downvotes.posts.unshift(req.params.id);
							userProfile.save().then(() => {
								post.upvotes.splice(removeIndex, 1);
								post.downvotes.unshift({ user: req.user.id });
								post.save().then((post) => res.json(post));
							});
						} else {
							userProfile.downvotes.posts.unshift(req.params.id);
							userProfile.save().then(() => {
								post.downvotes.unshift({ user: req.user.id });
								post.save().then((post) => res.json(post));
							});
						}
					})
					.catch(() => {
						res.status(404).json({ noPostFound: 'No Post Found with that id' });
					});
			} else {
				throw err;
			}
		})
		.catch(() => {
			res.status(404).json({ profileNotFound: 'Profile Not Found' });
		});
});

//@route POST api/posts/comment/upvote/:id/:comment_id
//@desc Upvote comment
//@access Private
router.post('/comment/upvote/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
	profile
		.findOne({ user: req.user.id })
		.then((userProfile) => {
			if (userProfile) {
				post
					.findById(req.params.id)
					.then((post) => {
						if (
							post.comments.filter((comment) => comment._id.toString() === req.params.comment_id)
								.length === 0
						) {
							return res.status(404).json({ commentNotExist: 'Comment does not exist' });
						}
						const upvoteIndex = post.comments
							.map((item) => {
								return item._id.toString();
							})
							.indexOf(req.params.comment_id);
						const comment = post.comments[upvoteIndex];
						if (comment.upvotes.filter((upvote) => upvote.user.toString() === req.user.id).length > 0) {
							//Remove upvote from comment if user has already upvoted the comment
							const removeIndex = comment.upvotes
								.map((item) => {
									item.user.toString();
								})
								.indexOf(req.user.id);
							let userProfileRemoveIndex;
							for (let i = 0; i < userProfile.upvotes.comments.length; i++) {
								if (
									userProfile.upvotes.comments[i].postId == req.params.id &&
									userProfile.upvotes.comments[i].commentId == req.params.comment_id
								) {
									userProfileRemoveIndex = i;
									break;
								}
							}
							userProfile.upvotes.comments.splice(userProfileRemoveIndex, 1);
							userProfile.save().then(() => {
								comment.upvotes.splice(removeIndex, 1);
								post.save().then((post) => res.json(post));
							});
						} else if (
							comment.downvotes.filter((downvote) => downvote.user.toString() === req.user.id).length > 0
						) {
							//Remove downvote from comment and add upvote
							const removeIndex = comment.downvotes
								.map((item) => {
									item.user.toString();
								})
								.indexOf(req.user.id);
							let userProfileRemoveIndex;
							for (let i = 0; i < userProfile.downvotes.comments.length; i++) {
								if (
									userProfile.downvotes.comments[i].postId == req.params.id &&
									userProfile.downvotes.comments[i].commentId == req.params.comment_id
								) {
									userProfileRemoveIndex = i;
									break;
								}
							}
							userProfile.downvotes.comments.splice(userProfileRemoveIndex, 1);
							userProfile.upvotes.comments.unshift({
								postId: req.params.id,
								commentId: req.params.comment_id
							});
							userProfile.save().then(() => {
								comment.downvotes.splice(removeIndex, 1);
								comment.upvotes.unshift({ user: req.user.id });
								post.save().then((post) => res.json(post));
							});
						} else {
							userProfile.upvotes.comments.unshift({
								postId: req.params.id,
								commentId: req.params.comment_id
							});
							userProfile.save().then(() => {
								comment.upvotes.unshift({ user: req.user.id });
								post.save().then((post) => res.json(post));
							});
						}
					})
					.catch(() => {
						res.status(404).json({ noPostFound: 'No Post Found with that id' });
					});
			} else {
				throw err;
			}
		})
		.catch(() => {
			res.status(404).json({ profileNotFound: 'Profile Not Found' });
		});
});

//@route POST api/posts/comment/downvote/:id/:comment_id
//@desc Downvote comment
//@access Private
router.post('/comment/downvote/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
	console.log('Inside Server response');
	profile
		.findOne({ user: req.user.id })
		.then((userProfile) => {
			if (userProfile) {
				post
					.findById(req.params.id)
					.then((post) => {
						if (
							post.comments.filter((comment) => comment._id.toString() === req.params.comment_id)
								.length === 0
						) {
							return res.status(404).json({ commentNotExist: 'Comment does not exist' });
						}
						const downvoteIndex = post.comments
							.map((item) => {
								return item._id.toString();
							})
							.indexOf(req.params.comment_id);
						const comment = post.comments[downvoteIndex];
						if (
							comment.downvotes.filter((downvote) => downvote.user.toString() === req.user.id).length > 0
						) {
							//Remove downvote from comment if user has already downvoted the comment
							const removeIndex = comment.downvotes
								.map((item) => {
									item.user.toString();
								})
								.indexOf(req.user.id);
							let userProfileRemoveIndex;
							for (let i = 0; i < userProfile.downvotes.comments.length; i++) {
								if (
									userProfile.downvotes.comments[i].postId == req.params.id &&
									userProfile.downvotes.comments[i].commentId == req.params.comment_id
								) {
									userProfileRemoveIndex = i;
									break;
								}
							}
							userProfile.downvotes.comments.splice(userProfileRemoveIndex, 1);
							userProfile.save().then(() => {
								comment.downvotes.splice(removeIndex, 1);
								post.save().then((post) => res.json(post));
							});
						} else if (
							comment.upvotes.filter((upvote) => upvote.user.toString() === req.user.id).length > 0
						) {
							//Remove upvote from comment and add downvote
							const removeIndex = comment.upvotes
								.map((item) => {
									item.user.toString();
								})
								.indexOf(req.user.id);
							let userProfileRemoveIndex;
							for (let i = 0; i < userProfile.upvotes.comments.length; i++) {
								if (
									userProfile.upvotes.comments[i].postId == req.params.id &&
									userProfile.upvotes.comments[i].commentId == req.params.comment_id
								) {
									userProfileRemoveIndex = i;
									break;
								}
							}
							userProfile.upvotes.comments.splice(userProfileRemoveIndex, 1);
							userProfile.downvotes.comments.unshift({
								postId: req.params.id,
								commentId: req.params.comment_id
							});
							userProfile.save().then(() => {
								comment.upvotes.splice(removeIndex, 1);
								comment.downvotes.unshift({ user: req.user.id });
								post.save().then((post) => res.json(post));
							});
						} else {
							userProfile.downvotes.comments.unshift({
								postId: req.params.id,
								commentId: req.params.comment_id
							});
							userProfile.save().then(() => {
								comment.downvotes.unshift({ user: req.user.id });
								post.save().then((post) => res.json(post));
							});
						}
					})
					.catch(() => {
						res.status(404).json({ noPostFound: 'No Post Found with that id' });
					});
			} else {
				throw err;
			}
		})
		.catch(() => {
			res.status(404).json({ profileNotFound: 'Profile Not Found' });
		});
});

//@route POST api/posts/comment/:id
//@desc Add a comment to a post
//@access Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validatePostComment(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}
	post
		.findById(req.params.id)
		.then((post) => {
			const newComment = {
				comment: req.body.comment,
				name: req.body.name,
				avatar: req.body.avatar,
				user: req.user.id
			};
			post.comments.unshift(newComment);
			post.save().then((post) => res.json(post));
		})
		.catch(() => {
			res.status(404).json({ noPostFound: 'No Post Found with that id' });
		});
});

//@route DELETE api/posts/comment/:id/:comment_id
//@desc Remove comment from post
//@access Private
router.delete('/comment/:id/:comment_id', (req, res) => {
	post
		.findById(req.params.id)
		.then((post) => {
			if (post.comments.filter((comment) => comment._id.toString() === req.params.comment_id).length === 0) {
				return res.status(404).json({ commentNotExist: 'Comment does not exist' });
			}
			const removeIndex = post.comments
				.map((item) => {
					return item._id.toString();
				})
				.indexOf(req.params.comment_id);
			post.comments[removeIndex].comment = 'Deleted';
			post.save().then((post) => res.json(post));
		})
		.catch(() => {
			res.status(404).json({ noPostFound: 'No Post Found with that id' });
		});
});

module.exports = router;
