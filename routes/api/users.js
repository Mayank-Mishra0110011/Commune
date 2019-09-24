const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../../models/User');
const keys = require('../../config/keys');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//@route GET api/users/test
//@desc Test user route
//@access Public
router.get('/test', (req, res) => {
	res.json({ msg: 'Users Works' });
});

//@route POST api/users/register
//@desc Register user
//@access Public
router.post('/register', (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}
	req.body.email = req.body.email.toLowerCase();
	user.findOne({ email: req.body.email }).then((user) => {
		if (user) {
			errors.email = 'Email already exists';
			return res.status(400).json(errors);
		} else {
			const avatar = gravatar.url(req.body.email, {
				s: '200',
				r: 'pg',
				d: 'mm'
			});
			const newUser = new User({
				name: req.body.name,
				email: req.body.email,
				avatar,
				password: req.body.password
			});
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if (err) throw err;
					newUser.password = hash;
					newUser.save().then((user) => {
						res.json(user);
					});
				});
			});
		}
	});
});

//@route POST api/users/login
//@desc User login / Return jwt token
//@access Public
router.post('/login', (req, res) => {
	const { errors, isValid } = validateLoginInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}
	const email = req.body.email.toLowerCase();
	const password = req.body.password;
	user
		.findOne({ email })
		.then((user) => {
			if (!user) {
				throw err;
			}
			bcrypt.compare(password, user.password).then((isEqual) => {
				if (isEqual) {
					const payload = {
						id: user.id,
						name: user.name,
						avatar: user.avatar
					};
					jwt.sign(payload, keys.secretKey, { expiresIn: 3600 }, (err, token) => {
						res.json({
							success: true,
							token: `Bearer ${token}`
						});
					});
				} else {
					errors.password = 'Password Incorrect';
					return res.status(400).json(errors);
				}
			});
		})
		.catch(() => {
			errors.email = 'User not found';
			res.status(404).json(errors);
		});
});

//@route GET api/users/current
//@desc Return current user
//@access Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
	res.json({
		id: req.user.id,
		name: req.user.name,
		email: req.user.email
	});
});

module.exports = router;
