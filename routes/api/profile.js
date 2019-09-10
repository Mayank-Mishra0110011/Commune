const express = require('express');
const router = express.Router();
const passport = require('passport');
const profile = require('../../models/Profile');
const user = require('../../models/User');
const validateProfileInput = require('../../validation/profile');

//@route GET api/profile/test
//@desc Test profile route
//@access Public
router.get('/test', (req, res) => {
	res.json({ msg: 'Profile Works' });
});

//@route GET api/profile
//@desc Get current users profile
//@access Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	const errors = {};
	profile
		.findOne({ user: req.user.id })
		.populate('user', [ 'name', 'avatar' ])
		.then((data) => {
			if (!data) {
				errors.noProfile = 'There is no profile of the user';
				return res.status(404).json(errors);
			}
			res.json(data);
		})
		.catch((err) => {
			res.status(404).json(err);
		});
});

//@route GET api/profile/all
//@desc GET all profiles
//@access Public
router.get('/all', (req, res) => {
	const errors = {};
	profile
		.find()
		.populate('user', [ 'name', 'avatar' ])
		.then((profiles) => {
			if (!profiles) {
				errors.noProfile = 'There are no profiles';
				res.status(400).json(errors);
			}
			res.json(profiles);
		})
		.catch((err) => {
			console.log(err);
		});
});

//@route GET api/profile/handle/:handle
//@desc GET profile by handle
//@access Public
router.get('/handle/:handle', (req, res) => {
	const errors = {};
	profile
		.findOne({ handle: req.params.handle })
		.populate('user', [ 'name', 'avatar' ])
		.then((profile) => {
			if (!profile) {
				errors.noProfile = 'There is no profile for this user';
				res.status(400).json(errors);
			}
			res.json(profile);
		})
		.catch((err) => {
			console.log(err);
		});
});

//@route GET api/profile/user/:user_id
//@desc GET profile by user ID
//@access Public
router.get('/user/:user_id', (req, res) => {
	const errors = {};
	profile
		.findOne({ user: req.params.user_id })
		.populate('user', [ 'name', 'avatar' ])
		.then((profile) => {
			if (!profile) {
				errors.noProfile = 'There is no profile for this user';
				res.status(400).json(errors);
			}
			res.json(profile);
		})
		.catch((err) => {
			console.log(err);
		});
});

//@route POST api/profile
//@desc Create or Edit users profile
//@access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validateProfileInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}
	const profileFields = {};
	profileFields.user = req.user.id;
	if (req.body.handle) {
		profileFields.handle = req.body.handle;
	}
	if (req.body.location) {
		profileFields.location = req.body.location;
	}
	if (req.body.bio) {
		profileFields.bio = req.body.bio;
	}
	profileFields.social = {};
	if (req.body.twitter) {
		profileFields.social.twitter = req.body.twitter;
	}
	if (req.body.facebook) {
		profileFields.social.facebook = req.body.facebook;
	}
	if (req.body.instagram) {
		profileFields.social.instagram = req.body.instagram;
	}
	profile.findOne({ user: req.user.id }).then((data) => {
		if (data) {
			//Update existing profile
			profile
				.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
				.then((updatedData) => {
					res.json(updatedData);
				});
		} else {
			//Create new profile
			profile.findOne({ handle: profileFields.handle }).then((handle) => {
				if (handle) {
					errors.handle = 'That user handle already exists';
					res.status(400).json(errors);
				}
				new Profile(profileFields).save().then((profile) => {
					res.json(profile);
				});
			});
		}
	});
});

//@route DELETE/api/profile
//@desc Delete user and profile
//@access Private
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	profile.findOneAndRemove({ user: req.user.id }).then(() => {
		user.findOneAndRemove({ _id: req.user.id }).then(() => {
			res.json({ success: true });
		});
	});
});

module.exports = router;
