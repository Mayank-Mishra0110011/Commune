const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
	let errors = {};
	data.handle = !isEmpty(data.handle) ? data.handle : '';
	if (!validator.isLength(data.handle, { min: 2, max: 30 })) {
		errors.handle = 'User handle needs to be betweeen 2 and 30 characters';
	}

	if (!isEmpty(data.twitter)) {
		if (!validator.isURL(data.twitter)) {
			errors.twitter = 'Not a valid URL';
		}
	}
	if (!isEmpty(data.facebook)) {
		if (!validator.isURL(data.facebook)) {
			errors.facebook = 'Not a valid URL';
		}
	}
	if (!isEmpty(data.instagram)) {
		if (!validator.isURL(data.instagram)) {
			errors.instagram = 'Not a valid URL';
		}
	}
	return {
		errors,
		isValid: isEmpty(errors)
	};
};
