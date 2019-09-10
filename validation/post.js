const validator = require('validator');
const isEmpty = require('./is-empty');

function validatePostInput(data) {
	let errors = {};
	data.title = !isEmpty(data.title) ? data.title : '';
	data.post = !isEmpty(data.post) ? data.post : '';
	if (!validator.isLength(data.title, { min: 2, max: 1000 })) {
		errors.title = 'Post Title Must be between 2 and 1000 characters';
	}
	if (!validator.isLength(data.post, { min: 10, max: 40000 })) {
		errors.post = 'Post Must be between 10 and 40000 characters';
	}
	if (validator.isEmpty(data.title)) {
		errors.title = 'Post must have a title';
	}
	if (validator.isEmpty(data.post)) {
		errors.post = 'Post cannot be empty';
	}
	return {
		errors,
		isValid: isEmpty(errors)
	};
}

function validatePostComment(data) {
	let errors = {};
	data.comment = !isEmpty(data.comment) ? data.comment : '';
	if (validator.isEmpty(data.comment)) {
		errors.comment = 'Comment cannot be empty';
	}
	return {
		errors,
		isValid: isEmpty(errors)
	};
}

module.exports = { validatePostInput, validatePostComment };
