const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
	let errors = {};
	data.name = !isEmpty(data.name) ? data.name : '';
	data.email = !isEmpty(data.email) ? data.email : '';
	data.password = !isEmpty(data.password) ? data.password : '';
	data.password2 = !isEmpty(data.password2) ? data.password2 : '';
	if (!validator.isLength(data.name, { min: 3, max: 20 })) {
		errors.name = 'Name must be between 3 and 30 characters long';
	}
	if (validator.isEmpty(data.name)) {
		errors.name = 'Name field is required';
	}
	if (validator.isEmpty(data.email)) {
		errors.email = 'Email field is required';
	}
	if (!validator.isEmail(data.email)) {
		errors.email = 'Email is invalid';
	}
	if (validator.isEmpty(data.password)) {
		errors.password = 'Password field is required';
	}
	if (!validator.isLength(data.password, { min: 8, max: 30 })) {
		errors.password = 'Password must be 8 to 30 characters long';
	}
	if (validator.isEmpty(data.password2)) {
		errors.password2 = 'Confirm Password field is required';
	}
	if (!validator.equals(data.password, data.password2)) {
		errors.password2 = 'Passwords do not match';
	}
	return {
		errors,
		isValid: isEmpty(errors)
	};
};
